#import "Common/ShaderLib/Shadows15.glsllib"

out vec4 outFragColor;

#ifdef PSSM
in float shadowPosition;
#endif

in vec4 projCoord0;
in vec4 projCoord1;
in vec4 projCoord2;
in vec4 projCoord3;

#ifdef POINTLIGHT
    in vec4 projCoord4;
    in vec4 projCoord5;
    in vec4 worldPos;
    uniform vec3 m_LightPos; 
#endif

#ifdef GLOWMASK
  uniform sampler2D m_GlowMask;
#endif

#ifdef DIFFUSEMAP
  uniform sampler2D m_DiffuseMap;
#endif

#ifdef DISCARD_ALPHA
    #ifdef COLOR_MAP
        uniform sampler2D m_ColorMap;
    #endif
    uniform float m_AlphaDiscardThreshold;
#endif

varying vec2 texCoord;

#ifdef FADE
uniform vec2 m_FadeInfo;
#endif

void main(){
    
    #ifdef DISCARD_ALPHA
        #ifdef COLOR_MAP
             float alpha = texture2D(m_ColorMap,texCoord).a;
        #else    
             float alpha = texture2D(m_DiffuseMap,texCoord).a;
        #endif
      
        if(alpha < m_AlphaDiscardThreshold){
            discard;
        }
    #endif
 
    float shadow = 1.0;
    #ifdef POINTLIGHT         
            shadow = getPointLightShadows(worldPos, m_LightPos,
                           m_ShadowMap0,m_ShadowMap1,m_ShadowMap2,m_ShadowMap3,m_ShadowMap4,m_ShadowMap5,
                           projCoord0, projCoord1, projCoord2, projCoord3, projCoord4, projCoord5);
    #else
       #ifdef PSSM
            shadow = getDirectionalLightShadows(m_Splits, shadowPosition,
                           m_ShadowMap0,m_ShadowMap1,m_ShadowMap2,m_ShadowMap3,
                           projCoord0, projCoord1, projCoord2, projCoord3);
       #else 
            //spotlight
            shadow = getSpotLightShadows(m_ShadowMap0,projCoord0);
       #endif
    #endif   
 
    #ifdef FADE
     	shadow = max(0.0,mix(shadow,1.0,(shadowPosition - m_FadeInfo.x) * m_FadeInfo.y));    
    #endif
    shadow = shadow * m_ShadowIntensity + (1.0 - m_ShadowIntensity); 
      
	float mask = 1.0;
	vec4 col = vec4(0.0);
	#ifdef GLOWMASK
		vec4 tex = texture2D(m_GlowMask,texCoord);
		mask = (tex.r+tex.g+tex.g)/3.0;
		#ifdef DIFFUSEMAP
			col = texture2D(m_DiffuseMap,texCoord);
		#endif
	#endif

    outFragColor =  vec4(shadow, shadow, shadow, 1.0) + mask * 3.0 *col;
}
