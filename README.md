# Masked Lighting

A lighted shader that appears unshaded even under the DLSR depending on the mask parameter. Set the texture parameter "GlowMask" to a glowmap to make those parts appear unshaded.

####Before:

![alt tag](http://i.imgur.com/mWtzIya.png)

####After:

![alt tag](http://i.imgur.com/SrmEzsM.png)


####Usage:

> material.setTexture("GlowMask",texture);

While that glows the material without a bloom filter you can still use a glowmap for the material on top of it with the usual "GlowMap" param.
