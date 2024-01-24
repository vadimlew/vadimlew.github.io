THREE.ShaderChunk['stars_pars_fragment'] = `   
    uniform sampler2D starTexture;
    uniform vec2 offset;

    vec4 stars(float starSize, float speed) {
        float step = 0.15;
        float halfStep = step / 2.0;

        vec4 result = vec4(0.05/2.0, 0, 0.12/2.0, 1);
        vec2 coord = gl_FragCoord.xy/resolution;

        coord -= offset * speed;

        float tileX = floor( coord.x / step );
        float tileY = floor( coord.y / step );

        vec2 point = vec2(
            tileX * step + halfStep,
            tileY * step + halfStep
        );

        point.x += 1.5 * starSize * sin( tileY * 10.0 * speed );
        point.y += 1.5 * starSize * cos( tileX * 10.0 * speed );            

        float dx = coord.x - point.x;
        float dy = coord.y - point.y;

        float size = starSize * abs( sin( (offset.x + point.y + point.x) * 30.0 * speed) );
        if (size <= 0.001) return result;

        if ( abs(dx) <= size && abs(dy) <= size ) {
            size *= 2.0;
            vec2 uv = vec2( 0.5 + dx / size, 0.5 + dy / size );						
            vec4 textureColor = texture( starTexture, uv ); 
            
            if (textureColor.a >= 1.0) {
                result = textureColor;                    
                result.r = fract( point.x*5.0 );
                result.g = fract( point.y*5.0 );
            }
        }			

        return result;
    }
`


THREE.ShaderChunk['water_pars_fragment'] = `    
    uniform float time;

    vec4 mod289(vec4 x) {
        return x - floor(x / 289.0) * 289.0;
    }

    vec4 permute(vec4 x) {
        return mod289((x * 34.0 + 1.0) * x);
    }

    vec4 snoise(vec3 v) {
        const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);

        // First corner
        vec3 i  = floor(v + dot(v, vec3(C.y)));
        vec3 x0 = v   - i + dot(i, vec3(C.x));

        // Other corners
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);

        vec3 x1 = x0 - i1 + C.x;
        vec3 x2 = x0 - i2 + C.y;
        vec3 x3 = x0 - 0.5;

        // Permutations
        vec4 p =
        permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0))
                                + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                                + i.x + vec4(0.0, i1.x, i2.x, 1.0));

        // Gradients: 7x7 points over a square, mapped onto an octahedron.
        // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
        vec4 j = p - 49.0 * floor(p / 49.0);  // mod(p,7*7)

        vec4 x_ = floor(j / 7.0);
        vec4 y_ = floor(j - 7.0 * x_); 

        vec4 x = (x_ * 2.0 + 0.5) / 7.0 - 1.0;
        vec4 y = (y_ * 2.0 + 0.5) / 7.0 - 1.0;

        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);

        vec4 s0 = floor(b0) * 2.0 + 1.0;
        vec4 s1 = floor(b1) * 2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

        vec3 g0 = vec3(a0.xy, h.x);
        vec3 g1 = vec3(a0.zw, h.y);
        vec3 g2 = vec3(a1.xy, h.z);
        vec3 g3 = vec3(a1.zw, h.w);

        // Compute noise and gradient at P
        vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
        vec4 m2 = m * m;
        vec4 m3 = m2 * m;
        vec4 m4 = m2 * m2;
        vec3 grad =
        -6.0 * m3.x * x0 * dot(x0, g0) + m4.x * g0 +
        -6.0 * m3.y * x1 * dot(x1, g1) + m4.y * g1 +
        -6.0 * m3.z * x2 * dot(x2, g2) + m4.z * g2 +
        -6.0 * m3.w * x3 * dot(x3, g3) + m4.w * g3;
        vec4 px = vec4(dot(x0, g0), dot(x1, g1), dot(x2, g2), dot(x3, g3));
        return 42.0 * vec4(grad, dot(m4, px));
    }    

    float water_caustics(vec3 pos) {
        vec4 n = snoise( pos );

        pos -= 0.07*n.xyz;
        pos *= 1.62;
        n = snoise( pos );

        pos -= 0.07*n.xyz;
        n = snoise( pos );

        pos -= 0.07*n.xyz;
        n = snoise( pos );
        return n.w;
    }
`


THREE.ShaderChunk['lava_pars_fragment'] = `    
    uniform sampler2D lavaTexture;

    vec3 mod289(vec3 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 taylorInvSqrt(vec4 r) {
        return 1.79284291400159 - 0.85373472095314 * r;
    }

    vec3 fade(vec3 t) {
        return t*t*t*(t*(t*6.0-15.0)+10.0);
    }       

    // Classic Perlin noise, periodic variant
    float pnoise(vec3 P, vec3 rep)  {
        vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
        vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
        Pi0 = mod289(Pi0);
        Pi1 = mod289(Pi1);
        vec3 Pf0 = fract(P); // Fractional part for interpolation
        vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
        vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
        vec4 iy = vec4(Pi0.yy, Pi1.yy);
        vec4 iz0 = Pi0.zzzz;
        vec4 iz1 = Pi1.zzzz;

        vec4 ixy = permute(permute(ix) + iy);
        vec4 ixy0 = permute(ixy + iz0);
        vec4 ixy1 = permute(ixy + iz1);

        vec4 gx0 = ixy0 * (1.0 / 7.0);
        vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
        gx0 = fract(gx0);
        vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
        vec4 sz0 = step(gz0, vec4(0.0));
        gx0 -= sz0 * (step(0.0, gx0) - 0.5);
        gy0 -= sz0 * (step(0.0, gy0) - 0.5);

        vec4 gx1 = ixy1 * (1.0 / 7.0);
        vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
        gx1 = fract(gx1);
        vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
        vec4 sz1 = step(gz1, vec4(0.0));
        gx1 -= sz1 * (step(0.0, gx1) - 0.5);
        gy1 -= sz1 * (step(0.0, gy1) - 0.5);

        vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
        vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
        vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
        vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
        vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
        vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
        vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
        vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

        vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
        g000 *= norm0.x;
        g010 *= norm0.y;
        g100 *= norm0.z;
        g110 *= norm0.w;
        vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
        g001 *= norm1.x;
        g011 *= norm1.y;
        g101 *= norm1.z;
        g111 *= norm1.w;

        float n000 = dot(g000, Pf0);
        float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
        float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
        float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
        float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
        float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
        float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
        float n111 = dot(g111, Pf1);

        vec3 fade_xyz = fade(Pf0);
        vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
        vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
        float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
        return 2.2 * n_xyz;
    }

    float random( vec3 scale, float seed ) {
        return fract( sin( dot( gl_FragCoord.xyz + seed, scale ) ) * 43758.5453 + seed ) ;
    }

    float turbulence( vec3 p ) {
        float w = 100.0;
        float t = -.5;
    
        for (float f = 1.0 ; f <= 10.0 ; f++ ){
        float power = pow( 2.0, f );
        t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );
        }        
       
        return t;          
    }        
`

THREE.ShaderChunk['rainbow_pars_fragment'] = `    
    uniform sampler2D rainbowTexture;

    vec2 rotateUV(vec2 uv, float rotation) {
        float mid = 0.5;
        return vec2 (
            cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
            cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
        );
    }
`

class PaintShader extends THREE.MeshLambertMaterial {
    constructor(options, paintTexture) {
        super(options);
        this.paintTexture = paintTexture;        
    }

    onBeforeCompile( shader ) {
        shader.uniforms.resolution = { value: new THREE.Vector2(window.innerWidth, window.innerWidth) };
        shader.uniforms.starTexture = { value: assets.textures.three.star };
        shader.uniforms.rainbowTexture = { value: assets.textures.three.textureRainbow };
        shader.uniforms.paintTexture = { value: this.paintTexture };
        shader.uniforms.lavaTexture = { value: assets.textures.three.lava };
        shader.uniforms.offset = { value: new THREE.Vector2(0, 0) };       
        shader.uniforms.time = { value: 0 };       

        shader.fragmentShader = `
            #define LAMBERT

            uniform vec3 diffuse;
            uniform vec3 emissive;
            uniform float opacity;

            uniform vec2 resolution;
            uniform sampler2D paintTexture;  

            #include <common>
            #include <packing>
            #include <dithering_pars_fragment>
            #include <color_pars_fragment>
            #include <uv_pars_fragment>
            #include <map_pars_fragment>
            #include <alphamap_pars_fragment>
            #include <alphatest_pars_fragment>
            #include <aomap_pars_fragment>
            #include <lightmap_pars_fragment>
            #include <emissivemap_pars_fragment>
            #include <envmap_common_pars_fragment>
            #include <envmap_pars_fragment>
            #include <fog_pars_fragment>
            #include <bsdfs>
            #include <lights_pars_begin>
            #include <normal_pars_fragment>
            #include <lights_lambert_pars_fragment>
            #include <shadowmap_pars_fragment>
            #include <bumpmap_pars_fragment>
            #include <normalmap_pars_fragment>
            #include <specularmap_pars_fragment>
            #include <logdepthbuf_pars_fragment>
            //#include <clipping_planes_pars_fragment>           

            #include <stars_pars_fragment>            
            #include <water_pars_fragment>   
            #include <lava_pars_fragment>   
            #include <rainbow_pars_fragment>           
            
            vec4 redColor = vec4(1, 0, 0, 1);
            vec4 greenColor = vec4(0, 1, 0, 1);
            vec4 blueColor = vec4(0, 0, 1, 1);
            vec4 yellowColor = vec4(1, 1, 0, 1);           

            bool testColor( vec4 pixel, vec4 testColor ) {
                float eps = 0.5f;
                return all( greaterThanEqual( pixel, testColor-eps ) ) && all( lessThanEqual( pixel, testColor+eps ) );
            }

            void main() {
                //#include <clipping_planes_fragment>

                bool useMap = true;
                vec4 paintPixel = texture( paintTexture, vMapUv );

                vec4 diffuseColor = vec4( diffuse, opacity );    
                
                // stars
                if ( testColor(paintPixel, redColor) ) {
                    vec4 result = stars(0.03, 1.0);
                    result += stars(0.02, -0.5);
                    //result += stars(0.018, -0.25);

                    gl_FragColor = mix( texture(map, vMapUv), result, paintPixel.r );
                    return;
                }

                //water
                if ( testColor(paintPixel, greenColor) ) {
                    vec2 p = (-resolution.xy + 6144.0 * vMapUv) / resolution.y;
        
                    vec3 ww = normalize(-vec3(0.0, 1.0, 0.01));
                    vec3 uu = normalize(cross(ww, vec3(0., 1., 0.)));
                    vec3 vv = normalize(cross(uu,ww));
                
                    vec3 rd = p.x*uu + p.y*vv + 1.5*ww;
                    vec3 pos = -ww + rd*(ww.y/rd.y);
                    pos.y = time * 0.75;
                    pos *= 3.;
                
                    float w = mix(water_caustics(pos), water_caustics(pos + 1.), 0.5);
                        
                    float intensity = exp(w*4. - 1.);

                    vec4 result = vec4( vec3(0.23, 0.51, 0.76) + vec3(intensity), 1 );
                    diffuseColor = mix( texture(map, vMapUv), result, paintPixel.g );
                    useMap = false;
                    //return;
                } 
                
                // lava
                if ( testColor(paintPixel, blueColor) ) {
                    float noise = -turbulence( 24.0 * vec3(vMapUv, 0) + time/2.0 );	      

                    float r = 0.02 * random( vec3( 12.9898, 78.233, 151.7182 ), 0.1 );
                    
                    vec2 tPos = vec2( 0, max(1.3 * noise, 0.01) );
                    vec4 color = texture2D( lavaTexture, tPos + r );
                    
                    gl_FragColor = mix( texture(map, vMapUv), vec4( color.rgb, 1.0 ), paintPixel.b );                    
                    return;
                }

                // rainbow
                if ( testColor(paintPixel, yellowColor) ) {    
                    vec2 rainbowUV = rotateUV(vMapUv, -0.5);                    
                    diffuseColor = texture( rainbowTexture, ( 15.0 * rainbowUV + offset * 5.0) );  
                    diffuseColor = mix( texture(map, vMapUv), diffuseColor, paintPixel.r );
                    useMap = false;                   
                }         

                ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
                vec3 totalEmissiveRadiance = emissive;

                #include <logdepthbuf_fragment>

                if (useMap) {
                    #include <map_fragment>
                }   

                #include <color_fragment>
                #include <alphamap_fragment>
                #include <alphatest_fragment>
                #include <specularmap_fragment>
                #include <normal_fragment_begin>
                #include <normal_fragment_maps>
                #include <emissivemap_fragment>
                #include <lights_lambert_fragment>
                #include <lights_fragment_begin>
                #include <lights_fragment_maps>
                #include <lights_fragment_end>
                #include <aomap_fragment>

                vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;

                #include <envmap_fragment>
                #include <output_fragment>
                #include <tonemapping_fragment>
                #include <encodings_fragment>
                #include <fog_fragment>
                #include <premultiplied_alpha_fragment>
                #include <dithering_fragment>
            }            
        `        
        app.update.add( ()=>this.update(shader) );
    }    


    update(shader) {
		shader.uniforms.offset.value.x += 0.002;
		shader.uniforms.offset.value.y += -0.001;
        shader.uniforms.time.value += 0.005;       
	}
}