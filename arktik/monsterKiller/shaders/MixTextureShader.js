class MixTextureShader extends THREE.MeshLambertMaterial {   
    maps;  

    constructor( options, maps ) {
        super(options);
        this.maps = maps;       
    }

    onBeforeCompile( shader ) {
        shader.uniforms.mapA = { value: this.maps.mapA };
        shader.uniforms.mapB = { value: this.maps.mapB };
            
        shader.fragmentShader = `
            #define LAMBERT           
           
            uniform vec3 diffuse;
            uniform vec3 emissive;
            uniform float opacity;

            uniform sampler2D mapA;
            uniform sampler2D mapB;            

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
            #include <clipping_planes_pars_fragment>

            vec2 hash2D2D (vec2 s){
                return fract(sin(mod(vec2(dot(s, vec2(127.1, 311.7)), dot(s, vec2(269.5,183.3))), 3.14159))*43758.5453);
            }
            
            vec4 tex2DStochastic(sampler2D tex, vec2 UV){
                mat4x3 BW_vx;
                vec2 skewUV = mat2x2(1.0 , 0.0 , -0.57735027 , 1.15470054) * (UV * 3.464);
                vec2 vxID = vec2(floor(skewUV));
                vec3 tNoise = vec3(fract(skewUV), 0);
                tNoise.z = 1.0-tNoise.x-tNoise.y;	
                if(tNoise.z > 0.0){
                    BW_vx = mat4x3(vec3(vxID, 0), vec3(vxID + vec2(0, 1), 0), vec3(vxID + vec2(1, 0), 0), tNoise.zyx);
                }else{
                    BW_vx = mat4x3(vec3(vxID + vec2 (1, 1), 0), vec3(vxID + vec2 (1, 0), 0), vec3(vxID + vec2 (0, 1), 0), vec3(-tNoise.z, 1.0-tNoise.y, 1.0-tNoise.x));
                }
                return 	( texture( tex, (UV + hash2D2D(BW_vx[0].xy)) ) ) * (BW_vx[3].x) + 
                        ( texture( tex, (UV + hash2D2D(BW_vx[1].xy)) ) ) * (BW_vx[3].y) + 
                        ( texture( tex, (UV + hash2D2D(BW_vx[2].xy)) ) ) * (BW_vx[3].z);
            }

            float mapScale = 30.0;

            void main() {
                #include <clipping_planes_fragment>

                vec4 diffuseColor = vec4( diffuse, opacity );                

                ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
                vec3 totalEmissiveRadiance = emissive;

                #include <logdepthbuf_fragment>
                #include <map_fragment>
                
                vec4 color1 = tex2DStochastic(mapA, vMapUv * mapScale);
                vec4 color2 = texture(mapB, vMapUv * mapScale);               
                vec3 colorResult = mix(color1.rgb, color2.rgb, diffuseColor.r);

                bool useNormal = diffuseColor.r > 0.2;

                diffuseColor = vec4(colorResult, 1.0);

                #include <color_fragment>
                #include <alphamap_fragment>
                #include <alphatest_fragment>
                #include <specularmap_fragment>
                #include <normal_fragment_begin>

                #ifdef USE_NORMALMAP_OBJECTSPACE
                    
                    if (useNormal) normal = texture2D( normalMap, vNormalMapUv * mapScale ).xyz * 2.0 - 1.0; // overrides both flatShading and attribute normals
                    
                    #ifdef FLIP_SIDED

                        if (useNormal) normal = - normal;

                    #endif

                    #ifdef DOUBLE_SIDED

                        if (useNormal) normal = normal * faceDirection;

                    #endif

                    if (useNormal) normal = normalize( normalMatrix * normal );

                #elif defined( USE_NORMALMAP_TANGENTSPACE )

                    vec3 mapN = texture2D( normalMap, vNormalMapUv * mapScale ).xyz * 2.0 - 1.0;
                    mapN.xy *= normalScale;

                    if (useNormal) normal = normalize( tbn * mapN );

                #elif defined( USE_BUMPMAP )

                    normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );

                #endif                

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
    }    
}