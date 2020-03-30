function getXRotate(radian) 
{
	var cos = Math.cos(radian);
	var sin = Math.sin(radian);	
	var Rx = [ 	[1, 0, 0],
				[0, cos, -sin],
				[0, sin, cos] ];
	return Rx;	
}

function getYRotate(radian) 
{
	var cos = Math.cos(radian);
	var sin = Math.sin(radian);	
	var Ry = [ 	[cos, 0, sin],
				[0, 1, 0],
				[-sin, 0, cos] ]; 
	return Ry;	
}

function getZRotate(radian) 
{
	var cos = Math.cos(radian);
	var sin = Math.sin(radian);	
	var Rz = [ 	[cos, -sin, 0],
				[sin, cos, 0],
				[0, 0, 1] ]; 
	return Rz;	
}

function applyMatrix(pixels, matrix)
{
	var x = 0, y = 0, z = 0;
	for (var i = 0; i < pixels.length; i++) 
	{
		x = pixels[i].hx;
		y = pixels[i].hy;
		z = pixels[i].hz;		
		pixels[i].x = (matrix[0][0] * x) + (matrix[0][1] * y) + (matrix[0][2] * z);		
		pixels[i].y = (matrix[1][0] * x) + (matrix[1][1] * y) + (matrix[1][2] * z);		
		pixels[i].z = (matrix[2][0] * x) + (matrix[2][1] * y) + (matrix[2][2] * z);				
	}     
}

function matrixMulti(matrixA, matrixB)
{
	var matrixC = [[0,0,0],[0,0,0],[0,0,0]];
	matrixC[0][0] = matrixA[0][0]*matrixB[0][0] + matrixA[0][1]*matrixB[1][0] + matrixA[0][2]*matrixB[2][0];
	matrixC[0][1] = matrixA[0][0]*matrixB[0][1] + matrixA[0][1]*matrixB[1][1] + matrixA[0][2]*matrixB[1][2];
	matrixC[0][2] = matrixA[0][0]*matrixB[0][2] + matrixA[0][1]*matrixB[1][2] + matrixA[0][2]*matrixB[2][2];
	
	matrixC[1][0] = matrixA[1][0]*matrixB[0][0] + matrixA[1][1]*matrixB[1][0] + matrixA[1][2]*matrixB[2][0];
	matrixC[1][1] = matrixA[1][0]*matrixB[0][1] + matrixA[1][1]*matrixB[1][1] + matrixA[1][2]*matrixB[2][1];
	matrixC[1][2] = matrixA[1][0]*matrixB[0][2] + matrixA[1][1]*matrixB[1][2] + matrixA[1][2]*matrixB[2][2];
	
	matrixC[2][0] = matrixA[2][0]*matrixB[0][0] + matrixA[2][1]*matrixB[1][0] + matrixA[2][2]*matrixB[2][0];
	matrixC[2][1] = matrixA[2][0]*matrixB[0][1] + matrixA[2][1]*matrixB[1][1] + matrixA[2][2]*matrixB[2][1];
	matrixC[2][2] = matrixA[2][0]*matrixB[0][2] + matrixA[2][1]*matrixB[1][2] + matrixA[2][2]*matrixB[2][2];
	
	return matrixC;
}

function generateRandomSphere(numPoints, minRadius, maxRadius)
{
	var points = [];
	var a = 0;
	var b = Math.PI/2;	
	var stepA = Math.PI / 10;
	for( var i = 0; i < numPoints; i++ )
	{
		var p = {};
		a += stepA * Math.random();
		b = Math.random()* Math.PI * 2;		
		var radius = minRadius + (maxRadius - minRadius) * Math.random();
		p.x = radius * Math.sin(a) * Math.cos(b);
		p.y = radius * Math.sin(a) * Math.sin(b);
		p.z = radius * Math.cos(a);		
		points.push(p);		
	}	
	return points;
}

function generateSphere(longitude=10, latitude=10, radius=10, sx=1, sy=1, sz=1)
{
	var points = [];
	var a = 0;
	var b = 0;
	var len = longitude*latitude;
	var stepA = Math.PI / (longitude+1);
	var stepB = 2*Math.PI / latitude;
	points.push({x:0,y:-radius,z:0});	
	for( var i = 0; i < len; i++ )
	{
		var p = {};
		a = stepA + stepA * (i % longitude);
		b = stepB * parseInt(i/longitude);
		p.x = radius * Math.sin(a) * Math.cos(b) * sx;		
		p.y = -radius * Math.cos(a) * sy;
		p.z = radius * Math.sin(a) * Math.sin(b) * sz;		
		points.push(p);		
	}	
	points.push({x:0,y:radius,z:0});
	return points;
}

function generateTore(R, r, L, M)
{
	var points = [];
	var a = 0;
	var b = 0;
	var len = L*M;
	var stepA = Math.PI / (longitude+1);
	var stepB = 2*Math.PI / latitude;
	points.push({x:0,y:-radius,z:0});	
	for( var i = 0; i < len; i++ )
	{
		var p = {};
		a = stepA + stepA * (i % longitude);
		b = stepB * parseInt(i/longitude);
		p.x = radius * Math.sin(a) * Math.cos(b) * sx;		
		p.y = -radius * Math.cos(a) * sy;
		p.z = radius * Math.sin(a) * Math.sin(b) * sz;		
		points.push(p);		
	}	
	points.push({x:0,y:radius,z:0});
	return points;
}

function sortByScreenZ( pixelA, pixelB )
{
	if ( pixelA.z == pixelB.z ) return 0;
	if ( pixelA.z > pixelB.z ) return 1;
	else return -1;
}	
