varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec3 vTexCoord3D;
varying vec3 tarPosition3D;
uniform float cellsDensity;
uniform float tarDensity;
uniform float breathing_cycle;

vec3 getPosition(vec3 positionIn)  {
	float max_z = -1.0;
	float min_z = -251.0;
	float max_y = -41.9418;
	float min_y = -196.627;
	float range_z = max_z - min_z;
	float range_y = max_y - min_y;
	float scale = 1.0;
	vec3 newPosition = positionIn * vec3(1.0, scale, scale);

	float lung_volume_0 = 4.0e6 * 180.0 / 200.0;
	float tidal_vol = 0.5e6 * 180.0 / 200.0;
	float vol_increment = tidal_vol * breathing_cycle;
 	float lung_volume = lung_volume_0 + vol_increment;
	float linear_scale = pow(lung_volume / lung_volume_0, 0.5);
	newPosition.y = newPosition.y * linear_scale;
	newPosition.z = newPosition.z * linear_scale;
	return newPosition;
}

void main(void) {
	vec4 mvPosition;
	mvPosition = modelViewMatrix * vec4( position, 1.0 );
	vViewPosition = -mvPosition.xyz;
	vec3 objectNormal;
	objectNormal = normal;
#ifdef FLIP_SIDED
	objectNormal = -objectNormal;
#endif
	vec3 transformedNormal = normalMatrix * objectNormal;
	vNormal = normalize( transformedNormal );
	vTexCoord3D = position.xyz * cellsDensity;
	tarPosition3D  = position.xyz * tarDensity;
	vec3 newPosition = getPosition(position);
	gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}