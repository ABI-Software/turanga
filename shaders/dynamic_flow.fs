varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec3 color_begin;
varying vec3 color_end;
varying vec3 color_asthmatic;
uniform vec3 ambient;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform vec3 ambientLightColor;
uniform	vec3 directionalLightColor;
uniform	vec3 directionalLightDirection;
uniform float time;
uniform float severity;
uniform float starting_time;
uniform float asthmaSeverity;

vec3 calculateSpectrumColor(float value)
{
	vec3 rgb = vec3( 0.0 );
	if (value<1.0/3.0)
	{
		rgb[0]=1.0;
		rgb[2]=0.0;
		if (value<1.0/6.0)
		{
			rgb[1]=value*4.5;
		}
		else
		{
			rgb[1]=0.75+(value-1.0/6.0)*1.5;
		}
	}
	else if (value<2.0/3.0)
	{
		rgb[1]=1.0;
		if (value<0.5)
		{
			rgb[0] = 2.5 - 4.5*value;
			rgb[2] = 1.5*value - 0.5;
		}
		else
		{
			rgb[0] = 1.0 - 1.5*value;
			rgb[2] = -2.0 + 4.5*value;
		}
	}
	else
	{
		rgb[0]=0.0;
		rgb[2]=1.0;
		if (value<5.0/6.0)
		{
			rgb[1]=1.0-(value-2.0/3.0)*1.5;
		}
		else
		{
			rgb[1]=0.75-(value-5.0/6.0)*4.5;
		}
	}
	return rgb;
}


vec3 calculateColor() {
	vec3 baseline = color_begin;
	vec3 smoker = color_end;
	vec3 asthma = color_asthmatic;
	float delta = baseline[0];
	if (severity > 0.0)
	{
		delta = (smoker[0] - baseline[0]) * severity / 2.0 + baseline[0];
	}
	else if (asthmaSeverity < 1.0)
	{
		delta = (asthma[0] - baseline[0]) * (1.0 - asthmaSeverity) / 0.4 + baseline[0];
	}
	vec3 my_color = calculateSpectrumColor(1.0 - delta);
	return my_color;

}

void main(void) {
	vec3 adjustDiffuse = calculateColor();
#ifdef ALPHATEST
	if ( gl_FragColor.a < ALPHATEST ) discard;
#endif
	float specularStrength = 1.0;
	vec3 normal = normalize( vNormal );

	
	if (!gl_FrontFacing)
		normal.z = -normal.z;
		
	vec3 viewPosition = normalize( vViewPosition );

#if NUM_DIR_LIGHTS > 0
	vec3 dirDiffuse  = vec3( 0.0 );
	vec3 dirSpecular = vec3( 0.0 );

	vec4 lDirection = viewMatrix * vec4( directionalLightDirection, 0.0 );
	vec3 dirVector = normalize( lDirection.xyz );
	float dotProduct = dot( normal, dirVector );
	#ifdef WRAP_AROUND
		float dirDiffuseWeightFull = max( dotProduct, 0.0 );
		float dirDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );
		vec3 dirDiffuseWeight = mix( vec3( dirDiffuseWeightFull ), vec3( dirDiffuseWeightHalf ), wrapRGB );
	#else
		float dirDiffuseWeight = max( dotProduct, 0.0 );
	#endif
	dirDiffuse += adjustDiffuse * directionalLightColor * dirDiffuseWeight;
	vec3 dirHalfVector = normalize( dirVector + viewPosition );
	float dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );
	float dirSpecularWeight = specularStrength * max( pow( dirDotNormalHalf, shininess ), 0.0 );
	float specularNormalization = ( shininess + 2.0001 ) / 8.0;
	vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( dirVector, dirHalfVector ), 0.0 ), 5.0 );
	dirSpecular += schlick * directionalLightColor * dirSpecularWeight * dirDiffuseWeight * specularNormalization;
#endif

vec3 totalDiffuse = vec3( 0.0 );
vec3 totalSpecular = vec3( 0.0 );
#if NUM_DIR_LIGHTS > 0
	totalDiffuse += dirDiffuse;
	totalSpecular += dirSpecular;
#endif
	gl_FragColor.xyz = totalDiffuse;
}
