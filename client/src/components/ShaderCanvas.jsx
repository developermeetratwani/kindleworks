import { useEffect, useRef } from 'react'

// ── WebGL Shader Sources ──────────────────────────────────────────────────────
const VERT_SRC = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAG_SRC = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform vec3 uCol1;
uniform vec3 uCol2;
uniform vec3 uBg;
uniform float uOpacity;
uniform float uLight;
varying vec2 vUv;

vec3 palette(float h){
  return mix(uCol1,uCol2,smoothstep(0.3,0.7,h));
}

vec3 tanhv(vec3 x){
  vec3 e=exp(-2.0*x);
  return (1.0-e)/(1.0+e);
}

vec2 sceneC(vec2 frag,vec2 r){
  vec2 P=(frag+frag-r)/r.x;
  float z=0.0,d=1e3;
  vec4 O=vec4(0.0);
  for(int k=0;k<39;k++){
    if(d<=1e-4)break;
    O=z*normalize(vec4(P,2.0,0.0))-vec4(0.0,4.0,1.0,0.0)/4.5;
    d=1.0-sqrt(length(O*O));
    z+=d;
  }
  return vec2(O.x,atan(O.z,O.y));
}

void main(){
  vec2 r=uRes;
  vec2 C_frag=vUv*r;
  vec2 uv0=(C_frag+C_frag-r)/r.x;
  float T=0.1*uTime*0.5+9.0;
  float angRings=max(1.0,floor(6.28318*0.6+0.5));
  vec2 Y=vec2(5e-3,6.28318/angRings);

  vec2 c0=sceneC(C_frag,r);
  vec2 cdx=sceneC(C_frag+vec2(1.0,0.0),r);
  vec2 cdy=sceneC(C_frag+vec2(0.0,1.0),r);
  vec2 dCx=cdx-c0; vec2 dCy=cdy-c0;
  dCx.y-=6.28318*floor(dCx.y/6.28318+0.5);
  dCy.y-=6.28318*floor(dCy.y/6.28318+0.5);
  vec2 fw=abs(dCx)+abs(dCy);
  vec2 CC=c0;

  vec2 P=2.0*uv0-vec2(0.0,r.y/r.x);
  vec4 O=uLight>0.5?vec4(0.0):vec4(uBg*90.0*0.5/(1e3*dot(P,P)+6.0),0.0);

  float mGlow=0.0;
  vec2 mN=(uMouse+uMouse-r)/r.x;
  float md=length(uv0-mN);
  mGlow=exp(-md*md/1.0)*0.5;
  O.rgb+=uCol1*mGlow*0.25;

  float zr=5e-4;
  vec2 rr=vec2(max(length(fw),1e-5));
  float tail=19.0;

  for(int m=0;m<8;m++){
    float jf=float(m)+1.0;
    float ic=fract(sin(dot(vec2(jf,floor(CC.x/Y.x+0.5)),vec2(7.0,11.0))*73.0));
    vec2 Pp=CC-(T+T*ic)*vec2(0.0,1.0);
    Pp-=floor(Pp/Y+0.5)*Y;
    float h=fract(8663.0*ic);
    vec3 col=palette(h);
    float weight=mix(1.5,1.0+sin(T+7.0*h+4.0),1.0);
    weight*=(1.0+mGlow*2.0);
    vec2 inner=vec2(length(max(Pp,vec2(-1.0,0.0))),length(Pp)-zr)-zr;
    vec2 sm=vec2(1.0)-smoothstep(-rr,rr,inner);
    O.rgb+=dot(sm,vec2(exp(tail*Pp.y),3.0))*col*weight;
    CC.x+=Y.x/8.0;
  }

  vec3 colr=sqrt(tanhv(max(O.rgb*1.0-vec3(0.04,0.08,0.02),0.0)));
  if(uLight>0.5){
    float peak=max(colr.r,max(colr.g,colr.b));
    float cov=smoothstep(0.035,0.58,peak)*uOpacity;
    vec3 chr=clamp(colr/max(peak,1e-4),0.0,1.0);
    chr=pow(chr,vec3(1.35));
    float cp=max(chr.r,max(chr.g,chr.b));
    chr/=max(cp,1e-4);
    gl_FragColor=vec4(mix(vec3(1.0),chr,cov*0.94),1.0);
  }else{
    gl_FragColor=vec4(colr,uOpacity);
  }
}
`

function hexToRgb(hex) {
  hex = hex.replace('#', '')
  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255,
  ]
}

/**
 * ShaderCanvas — a React wrapper around the Lightfall WebGL shader.
 *
 * Props:
 *   col1    — hex color #rrggbb
 *   col2    — hex color #rrggbb
 *   bg      — hex color #rrggbb
 *   opacity — float 0..1
 *   isLight — bool (light-mode overlay vs dark glow)
 */
export default function ShaderCanvas({ col1, col2, bg, opacity, isLight }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl =
      canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false }) ||
      canvas.getContext('experimental-webgl', { alpha: true })
    if (!gl) return

    // Compile shaders
    function compile(type, src) {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }

    const prog = gl.createProgram()
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT_SRC))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG_SRC))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const pos = gl.getAttribLocation(prog, 'position')
    gl.enableVertexAttribArray(pos)
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)

    const uRes    = gl.getUniformLocation(prog, 'uRes')
    const uTime   = gl.getUniformLocation(prog, 'uTime')
    const uMouse  = gl.getUniformLocation(prog, 'uMouse')
    const uCol1L  = gl.getUniformLocation(prog, 'uCol1')
    const uCol2L  = gl.getUniformLocation(prog, 'uCol2')
    const uBgL    = gl.getUniformLocation(prog, 'uBg')
    const uOpL    = gl.getUniformLocation(prog, 'uOpacity')
    const uLightL = gl.getUniformLocation(prog, 'uLight')

    const c1  = hexToRgb(col1)
    const c2  = hexToRgb(col2)
    const bgc = hexToRgb(bg)
    gl.uniform3f(uCol1L,  c1[0],  c1[1],  c1[2])
    gl.uniform3f(uCol2L,  c2[0],  c2[1],  c2[2])
    gl.uniform3f(uBgL,  bgc[0], bgc[1], bgc[2])
    gl.uniform1f(uOpL,  opacity)
    gl.uniform1f(uLightL, isLight ? 1 : 0)

    const mouse = [0, 0]
    const onPointer = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse[0] = (e.clientX - rect.left) * (canvas.width / rect.width)
      mouse[1] = (rect.height - (e.clientY - rect.top)) * (canvas.height / rect.height)
    }
    canvas.addEventListener('pointermove', onPointer)

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect()
      const dpr  = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width  = rect.width  * dpr
      canvas.height = rect.height * dpr
    }
    resize()
    window.addEventListener('resize', resize)

    let visible = false
    const obs = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting
    }, { threshold: 0 })
    obs.observe(canvas)

    let rafId
    const loop = (t) => {
      rafId = requestAnimationFrame(loop)
      if (!visible) return
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uRes,   canvas.width, canvas.height)
      gl.uniform1f(uTime,  t * 0.001)
      gl.uniform2f(uMouse, mouse[0], mouse[1])
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    rafId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('pointermove', onPointer)
      obs.disconnect()
    }
  }, [col1, col2, bg, opacity, isLight])

  return <canvas ref={canvasRef} className="shader-bg" aria-hidden="true" />
}
