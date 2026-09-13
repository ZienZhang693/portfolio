'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

type PortfolioSlide = {
  src:string;
};

type Project = { id:string; title:string; subtitle:string; highlight?:string; type:string; year:string; image?:string; thumb?:string; gallery?:string[]; slides?:PortfolioSlide[]; orbitalGallery?:boolean; tone?:string; href?:string; fit?:'cover'|'contain' };

const projects: Project[] = [
  { id:'01', title:'重生之亡妻回忆录', subtitle:'女明星因一枚旧耳钉，穿越回刑警前女友死亡之前，在试图改写她命运的过程中，发现那场死亡背后隐藏着远比想象更复杂的真相。', highlight:'上线抖音 2 天获得 4.2 万+播放、3900+点赞。', type:'AI SHORT DRAMA / DIRECTION', year:'NEW', image:'/portfolio/reborn-wife-01.png', thumb:'/portfolio/reborn-wife-01.png', gallery:['/portfolio/reborn-wife-01.png','/portfolio/reborn-wife-02.png','/portfolio/reborn-wife-03.png'], href:'https://www.bilibili.com/video/BV1RnY66dETL/?share_source=copy_web&vd_source=de6d5034036a4e4397338488290df94e' },
  { id:'02', title:'一秒钟', subtitle:'借鉴日剧悬疑类型的叙事风格，以“一镜到底”形式创作的 AI 短片。三位关系错综复杂的人物因一次偶然相遇，被卷入一桩无差别杀人案，在彼此试探与线索交错中逐步逼近真相。', type:'AI SHORT FILM / DIRECTION', year:'NEW', image:'/portfolio/one-second.png', thumb:'/portfolio/one-second.png', href:'https://www.bilibili.com/video/BV1fUYB6fEh5/?share_source=copy_web&vd_source=de6d5034036a4e4397338488290df94e' },
  { id:'03', title:'重生之亡妻回忆录', subtitle:'围绕《重生之亡妻回忆录》两位女主展开的 IP 衍生内容创作。考虑到 AI 漫剧制作周期较长，为承接评论区的追更热度，同步更新角色日常与拍摄花絮，维持粉丝期待与 IP 活跃度。', type:'AI SOCIAL CONTENT / VISUAL', year:'NEW', image:'/portfolio/reborn-wife-02.png', thumb:'/portfolio/reborn-wife-02.png', orbitalGallery:true, gallery:['/portfolio/cp-bts-01.png','/portfolio/cp-bts-02.png','/portfolio/cp-bts-03.png','/portfolio/cp-bts-04.png','/portfolio/cp-bts-05.png','/portfolio/cp-bts-06.png'], href:'https://www.bilibili.com/video/BV1RnY66dETL/?share_source=copy_web&vd_source=de6d5034036a4e4397338488290df94e' },
  { id:'04', title:'封校年华', subtitle:'以抽帧、粤语旁白与片段叙事留下封校时期的影像注脚', type:'NARRATIVE SHORT', year:'04:03', image:'/portfolio/lockdown-years.jpg', href:'https://www.bilibili.com/video/BV13G411N7vg/', slides:[{src:'/portfolio/slides/lockdown-01.png'}] },
  { id:'05', title:'归属', subtitle:'关于流浪动物、救助者与“归处”的纪录片', type:'DOCUMENTARY', year:'16:09', image:'/portfolio/belonging-poster-v4.png', thumb:'/portfolio/belonging-poster-v4.png', href:'https://www.bilibili.com/video/BV1n6421g7AB/', slides:[{src:'/portfolio/slides/belonging-01.png'},{src:'/portfolio/slides/belonging-02.png'},{src:'/portfolio/slides/belonging-03.png'}] },
  { id:'06', title:'一键变身贝爷？', subtitle:'为 Columbia “Transit”年轻化转型创作的品牌短片', type:'BRANDED VLOG', year:'00:58', image:'/portfolio/columbia-vlog-poster.png', thumb:'/portfolio/columbia-vlog-poster.png', slides:[{src:'/portfolio/slides/columbia-01.png'},{src:'/portfolio/slides/columbia-02.png'},{src:'/portfolio/slides/columbia-03.png'}] },
  { id:'07', title:'城市逃亡', subtitle:'实拍城市与彩色特效城市群之间的情绪穿行', type:'VFX NARRATIVE', year:'04:03', image:'/portfolio/city-escape-poster-v2.png', thumb:'/portfolio/city-escape-poster-v2.png', href:'https://www.bilibili.com/video/BV1oK421r78K/', slides:[{src:'/portfolio/slides/playground-01.png'},{src:'/portfolio/slides/playground-02.png'},{src:'/portfolio/slides/playground-03.png'}] },
];

function Artwork({ project, small=false }:{ project:Project; small?:boolean }) {
  const source = small ? (project.thumb ?? project.image) : project.image;
  return source ? <img className={!small && project.fit === 'contain' ? 'contain' : ''} src={source} alt="" /> : <><span className="film-noise" /><span className="art-orbit" /><b>AI / {project.id}</b></>;
}

function DetailOrbitGallery({images,title}:{images:string[];title:string}) {
  const [active,setActive] = useState(0);
  const coreRef = useRef<HTMLButtonElement|null>(null);
  const thumbRefs = useRef<Array<HTMLButtonElement|null>>([]);
  const targetRef = useRef({x:0,y:0,rotation:0});
  const motionRef = useRef({x:0,y:0,rotation:0});
  const activeRef = useRef(0);
  const hoverPausedRef = useRef(false);
  const manualUntilRef = useRef(0);
  const dragRef = useRef<{x:number;rotation:number}|null>(null);

  const focusPhoto = useCallback((index:number) => {
    const step = Math.PI * 2 / images.length;
    const base = -index * step;
    const turn = Math.round((targetRef.current.rotation - base) / (Math.PI * 2));
    targetRef.current.rotation = base + turn * Math.PI * 2;
    activeRef.current = index;
    manualUntilRef.current = performance.now() + 850;
    setActive(index);
  }, [images.length]);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const step = Math.PI * 2 / images.length;
    let frame = 0;
    const render = (time:number) => {
      const target = targetRef.current;
      const motion = motionRef.current;
      const lerp = reducedMotion.matches ? 1 : .06;
      motion.x += (target.x-motion.x)*lerp;
      motion.y += (target.y-motion.y)*lerp;
      motion.rotation += (target.rotation-motion.rotation)*lerp;
      const parallax = reducedMotion.matches ? .2 : 1;
      if (coreRef.current) coreRef.current.style.transform = `translate3d(calc(-50% + ${motion.x*7*parallax}px),calc(-50% + ${motion.y*4*parallax}px),0)`;
      let front = 0;
      let frontDepth = -1;
      thumbRefs.current.forEach((thumb,index) => {
        if (!thumb) return;
        const angle = Math.PI/2 + index*step + motion.rotation;
        const depth = (Math.sin(angle)+1)/2;
        thumb.style.left = `${50 + Math.cos(angle)*44 + motion.x*1.6*parallax}%`;
        thumb.style.top = `${48 + Math.sin(angle)*22 + motion.y*2.2*parallax}%`;
        thumb.style.opacity = `${.22 + depth*.78}`;
        thumb.style.zIndex = `${2 + Math.round(depth*20)}`;
        thumb.style.filter = `saturate(${.55+depth*.45}) blur(${(1-depth)*.5}px)`;
        thumb.style.transform = `translate3d(-50%,-50%,${depth*80}px) rotateY(${Math.cos(angle)*-28*parallax}deg) scale(${.5+depth*.52})`;
        if (depth > frontDepth) { frontDepth = depth; front = index; }
      });
      if (!hoverPausedRef.current && time > manualUntilRef.current && front !== activeRef.current) {
        activeRef.current = front;
        setActive(front);
      }
      frame = window.requestAnimationFrame(render);
    };
    frame = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(frame);
  }, [images.length]);

  const handleMove = (event:ReactPointerEvent<HTMLDivElement>) => {
    if (hoverPausedRef.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(-1,Math.min(1,((event.clientX-rect.left)/rect.width-.5)*2));
    const y = Math.max(-1,Math.min(1,((event.clientY-rect.top)/rect.height-.5)*2));
    if (event.pointerType !== 'mouse' && dragRef.current) {
      const delta = event.clientX-dragRef.current.x;
      targetRef.current.rotation = dragRef.current.rotation + delta*.004;
      targetRef.current.x = Math.max(-1,Math.min(1,delta/(rect.width*.4)));
      targetRef.current.y = y;
      return;
    }
    targetRef.current = {x,y,rotation:x*1.25};
  };

  return <div className="detail-orbit-gallery" onPointerMove={handleMove} onPointerLeave={() => { targetRef.current.y = 0; }} onPointerDown={(event) => { if (event.pointerType !== 'mouse') { dragRef.current = {x:event.clientX,rotation:targetRef.current.rotation}; event.currentTarget.setPointerCapture(event.pointerId); } }} onPointerUp={(event) => { if (event.pointerType !== 'mouse') dragRef.current = null; }}>
    <button ref={coreRef} className="detail-orbit-core" type="button" onClick={() => focusPhoto((active+1)%images.length)} aria-label="查看下一张幕后花絮">
      <img key={images[active]} src={images[active]} alt={`${title} 幕后花絮 ${active+1}`} />
    </button>
    <div className="detail-photo-orbit" aria-label="幕后花絮图片">
      {images.map((image,index) => <button key={image} ref={(node) => { thumbRefs.current[index] = node; }} className={`detail-orbit-thumb ${index===active?'is-active':''}`} type="button" onPointerEnter={() => { hoverPausedRef.current = true; activeRef.current = index; setActive(index); }} onPointerLeave={() => { hoverPausedRef.current = false; manualUntilRef.current = performance.now()+260; }} onFocus={() => { activeRef.current=index; setActive(index); }} onClick={() => focusPhoto(index)} aria-label={`查看幕后花絮 ${index+1}`}><img src={image} alt="" /></button>)}
    </div>
    <div className="detail-orbit-controls"><span>{String(active+1).padStart(2,'0')} / {String(images.length).padStart(2,'0')}</span><div><button type="button" onClick={() => focusPhoto((active-1+images.length)%images.length)} aria-label="上一张幕后花絮">←</button><button type="button" onClick={() => focusPhoto((active+1)%images.length)} aria-label="下一张幕后花絮">→</button></div></div>
  </div>;
}

function RebornWifeDetail() {
  return <section className="project-editorial" id="project-copy-01" aria-label="重生之亡妻回忆录项目介绍">
    <div className="editorial-heading">
      <span>PROJECT STORY &amp; OUTCOME / 01</span>
      <h3>从一次死亡，回到真相发生之前。</h3>
    </div>
    <div className="editorial-grid">
      <article>
        <span>STORY / 故事梗概</span>
        <h4>双女主：女明星 × 刑警</h4>
        <p>刑警林晚星牺牲两年后，一枚定情耳钉将她的女友带回死亡发生之前。</p>
        <p>女明星半夏以为只要阻止那场任务，就能救回爱人，却发现林晚星的死亡并非意外。更危险的是——<strong>她每改变一次过去，熟悉的时间线就偏离得更远。</strong></p>
        <p>在一切彻底失控前，她必须找到死亡背后的真相，再决定是否付得起改写命运的代价。</p>
      </article>
      <article>
        <span>OUTCOME / 项目成果</span>
        <h4>35 秒先导片，上线 2 天</h4>
        <p>个人首部原创 AI 漫剧，目前仅发布 35 秒先导片。</p>
        <ul className="result-metrics">
          <li><strong>4.2 万+</strong><span>播放</span></li>
          <li><strong>3900+</strong><span>点赞</span></li>
          <li><strong>340</strong><span>收藏</span></li>
          <li><strong>81</strong><span>评论</span></li>
        </ul>
        <p className="editorial-note">抖音账号：<strong>86951311965</strong><br />B 站用于作品存档，传播数据以抖音为准。</p>
      </article>
    </div>
    <div className="editorial-production">
      <article>
        <span>AI PRODUCTION / AI 制作能力</span>
        <p>使用 <strong>ChatGPT 5.6 Sol</strong> 完成人物设定、三视图、场景与分镜设计，通过 Prompt 调试控制角色一致性和镜头连续性；使用 <strong>LiblibAI / Seedance 2.5</strong> 完成图生视频、人物动作与镜头运动。</p>
      </article>
      <article>
        <span>PIPELINE / 核心能力</span>
        <p className="pipeline">故事策划 <b>→</b> 角色开发 <b>→</b> 分镜设计 <b>→</b> Prompt Engineering <b>→</b> 图生视频 <b>→</b> 发布与数据验证</p>
      </article>
    </div>
  </section>;
}

export default function Home() {
  const [active, setActive] = useState(0);
  const [splashVisible, setSplashVisible] = useState(true);
  const [indexOpen, setIndexOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<number|null>(null);
  const [detailSlide, setDetailSlide] = useState(0);
  const coreRef = useRef<HTMLButtonElement|null>(null);
  const posterRefs = useRef<Array<HTMLButtonElement|null>>([]);
  const targetRef = useRef({x:0,y:0,rotation:0});
  const motionRef = useRef({x:0,y:0,rotation:0});
  const activeRef = useRef(0);
  const hoverPausedRef = useRef(false);
  const manualFocusUntilRef = useRef(0);
  const dragRef = useRef<{startX:number;originRotation:number}|null>(null);
  const detailDragRef = useRef<number|null>(null);
  const current = projects[active];
  const detailProject = selectedProject === null ? null : projects[selectedProject];
  const detailImages = detailProject ? (detailProject.gallery ?? (detailProject.image ? [detailProject.image] : [])) : [];

  const openProject = (index:number) => {
    setDetailSlide(0);
    setSelectedProject(index);
  };

  const shiftDetail = useCallback((direction:number) => {
    setDetailSlide((slide) => {
      const length = selectedProject === null ? 0 : (projects[selectedProject].gallery?.length ?? (projects[selectedProject].image ? 1 : 0));
      return length > 0 ? (slide + direction + length) % length : 0;
    });
  }, [selectedProject]);

  const focusProject = useCallback((index:number) => {
    const step = (Math.PI * 2) / projects.length;
    const currentRotation = targetRef.current.rotation;
    const baseRotation = -index * step;
    const nearestTurn = Math.round((currentRotation - baseRotation) / (Math.PI * 2));
    targetRef.current.rotation = baseRotation + nearestTurn * Math.PI * 2;
    activeRef.current = index;
    manualFocusUntilRef.current = performance.now() + 900;
    setActive(index);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setSplashVisible(false), 2400);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onKey = (event:KeyboardEvent) => {
      if (event.key === 'Escape') { setSplashVisible(false); setIndexOpen(false); setContactOpen(false); setSelectedProject(null); }
      if (selectedProject !== null) {
        if (event.key === 'ArrowRight') shiftDetail(1);
        if (event.key === 'ArrowLeft') shiftDetail(-1);
        return;
      }
      if (indexOpen || contactOpen || splashVisible) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') focusProject((active + 1) % projects.length);
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') focusProject((active - 1 + projects.length) % projects.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, contactOpen, focusProject, indexOpen, selectedProject, shiftDetail, splashVisible]);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const step = (Math.PI * 2) / projects.length;

    const renderOrbit = (time:number) => {
      const target = targetRef.current;
      const motion = motionRef.current;
      const lerp = reducedMotion.matches ? 1 : 0.055;
      motion.x += (target.x - motion.x) * lerp;
      motion.y += (target.y - motion.y) * lerp;
      motion.rotation += (target.rotation - motion.rotation) * lerp;

      const parallaxScale = reducedMotion.matches ? 0.2 : 1;
      if (coreRef.current) {
        coreRef.current.style.transform = `translate3d(calc(-50% + ${motion.x * 8 * parallaxScale}px),calc(-50% + ${motion.y * 5 * parallaxScale}px),0)`;
      }

      let frontIndex = 0;
      let frontDepth = -1;
      posterRefs.current.forEach((poster,index) => {
        if (!poster) return;
        const angle = Math.PI / 2 + index * step + motion.rotation;
        const depth = (Math.sin(angle) + 1) / 2;
        const x = 50 + Math.cos(angle) * 40 + motion.x * 1.4 * parallaxScale;
        const y = 49 + Math.sin(angle) * 24 + motion.y * 2.2 * parallaxScale;
        const scale = 0.46 + depth * 0.56;
        const opacity = 0.24 + depth * 0.76;
        const rotateY = Math.cos(angle) * -30 * parallaxScale;

        poster.style.left = `${x}%`;
        poster.style.top = `${y}%`;
        poster.style.opacity = `${opacity}`;
        poster.style.zIndex = `${2 + Math.round(depth * 20)}`;
        poster.style.filter = `saturate(${0.55 + depth * 0.45}) blur(${(1-depth)*0.45}px)`;
        poster.style.transform = `translate3d(-50%,-50%,${depth * 90}px) rotateY(${rotateY}deg) scale(${scale})`;
        poster.dataset.depth = depth > 0.56 ? 'front' : 'back';
        if (depth > frontDepth) { frontDepth = depth; frontIndex = index; }
      });

      if (!hoverPausedRef.current && time > manualFocusUntilRef.current && frontIndex !== activeRef.current) {
        activeRef.current = frontIndex;
        setActive(frontIndex);
      }
      frame = window.requestAnimationFrame(renderOrbit);
    };

    frame = window.requestAnimationFrame(renderOrbit);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const handlePointerMove = (event:ReactPointerEvent<HTMLElement>) => {
    if (hoverPausedRef.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(-1,Math.min(1,((event.clientX-rect.left)/rect.width-.5)*2));
    const y = Math.max(-1,Math.min(1,((event.clientY-rect.top)/rect.height-.5)*2));
    if (event.pointerType === 'touch' && dragRef.current) {
      const delta = event.clientX - dragRef.current.startX;
      targetRef.current.rotation = dragRef.current.originRotation + delta * 0.004;
      targetRef.current.x = Math.max(-1,Math.min(1,delta / (rect.width * .45)));
      targetRef.current.y = y;
      return;
    }
    targetRef.current = {x,y,rotation:x * 1.35};
  };

  const handlePointerDown = (event:ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') {
      dragRef.current = {startX:event.clientX,originRotation:targetRef.current.rotation};
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };

  const handlePointerUp = (event:ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') dragRef.current = null;
  };

  const handleDetailPointerUp = (event:ReactPointerEvent<HTMLButtonElement>) => {
    if (detailImages.length < 2 || detailDragRef.current === null) return;
    const delta = event.clientX - detailDragRef.current;
    const rect = event.currentTarget.getBoundingClientRect();
    detailDragRef.current = null;
    if (Math.abs(delta) > 28) shiftDetail(delta < 0 ? 1 : -1);
    else shiftDetail(event.clientX > rect.left + rect.width / 2 ? 1 : -1);
  };

  return (
    <main className="portfolio-shell">
      <section className={`splash ${splashVisible ? 'is-visible' : 'is-hidden'}`} aria-hidden={!splashVisible} onClick={() => setSplashVisible(false)}>
        <p><strong>Amber Zhang</strong><span>复旦大学广电，AI短剧，纪录片，品牌内容创作者</span></p>
        <span className="splash-count">ENTERING WORKS</span>
      </section>

      <header className="hud">
        <a className="brand" href="#top" aria-label="Amber Zhang 作品集首页">ZZE®</a>
        <span className="role">FILM · AI VISUAL · STORY</span>
        <nav aria-label="主要导航"><button type="button" onClick={() => setIndexOpen(true)}>INDEX</button></nav>
        <button className="contact-link" type="button" onClick={() => setContactOpen(true)}>CONTACT ↗</button>
      </header>

      <section className="stage" id="top" aria-live="polite" onPointerMove={handlePointerMove} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp} onPointerLeave={() => { targetRef.current.y = 0; }}>
        <div className="stage-label"><span>SELECTED WORK</span><span>MOVE TO ORBIT · HOVER TO FOCUS · CLICK TO OPEN</span><span>2022—2026</span></div>
        <div className="planet-system">
          <button ref={coreRef} className={`planet-core ${current.tone ?? ''}`} type="button" onClick={() => openProject(active)} aria-label={`打开 ${current.title} 详情`}>
            <span className="core-image" key={current.id}><Artwork project={current} /></span>
            <span className="core-label">{current.type} / {current.id}</span>
          </button>

          <div className="poster-orbit" role="list" aria-label="全部作品海报">
            {projects.map((project,index) => (
                <button key={project.id} ref={(node) => { posterRefs.current[index] = node; }} role="listitem" className={`orbit-poster ${project.tone ?? ''} ${index === active ? 'is-active' : ''}`} type="button" onPointerEnter={() => { hoverPausedRef.current = true; activeRef.current = index; setActive(index); }} onPointerLeave={() => { hoverPausedRef.current = false; manualFocusUntilRef.current = performance.now() + 320; }} onFocus={() => { activeRef.current = index; setActive(index); }} onClick={() => openProject(index)} aria-label={`打开 ${project.title} 详情`}>
                  <Artwork project={project} small />
                  <span>{project.id}</span>
                </button>
            ))}
          </div>
        </div>

        <div className="project-caption">
          <span>{current.id} / {String(projects.length).padStart(2,'0')}</span>
          <div><h1>{current.title}</h1><p>{current.subtitle}{current.highlight && <><br /><strong>{current.highlight}</strong></>}</p></div>
          <div className="caption-actions"><span>{current.year}</span>{current.href ? <a href={current.href} target="_blank" rel="noreferrer">VIDEO ↗</a> : <span>VIDEO TO ADD</span>}<button type="button" onClick={() => openProject(active)}>DETAIL ↗</button></div>
        </div>
        <div className="project-controls"><button type="button" aria-label="上一个项目" onClick={() => focusProject((active-1+projects.length)%projects.length)}>←</button><button type="button" aria-label="下一个项目" onClick={() => focusProject((active+1)%projects.length)}>→</button></div>
        <div className="scroll-meter" aria-hidden="true"><span style={{width:`${((active+1)/projects.length)*100}%`}} /></div>
      </section>

      <aside className={`index-panel ${indexOpen?'is-open':''}`} aria-hidden={!indexOpen}>
        <div className="panel-top"><span>PROJECT INDEX</span><button type="button" onClick={() => setIndexOpen(false)}>CLOSE ×</button></div>
        <ol>{projects.map((project,index)=><li key={project.id}><button type="button" onClick={()=>{focusProject(index);setIndexOpen(false)}}><span>{project.id}</span><strong>{project.title}</strong><span>{project.type}</span></button></li>)}</ol>
      </aside>

      <aside className={`contact-panel ${contactOpen?'is-open':''}`} aria-hidden={!contactOpen}>
        <div className="panel-top"><span>CONTACT</span><button type="button" onClick={() => setContactOpen(false)}>CLOSE ×</button></div>
        <div className="contact-list"><a href="mailto:18125262585@163.com"><span>EMAIL</span><strong>18125262585@163.com ↗</strong></a><a href="tel:+8618125262585"><span>PHONE / CN</span><strong>+86 181 2526 2585 ↗</strong></a><a href="tel:+447962878371"><span>PHONE / UK</span><strong>+44 7962 878371 ↗</strong></a><div><span>WECHAT</span><strong>zze18125262585</strong></div></div>
      </aside>

      {detailProject && <section className="project-detail" aria-label={`${detailProject.title} 详情`}>
        <div className="panel-top"><span>PROJECT / {detailProject.id}</span><button type="button" onClick={()=>setSelectedProject(null)}>CLOSE ×</button></div>
        <div className="detail-layout">
          <div className="detail-copy"><span>{detailProject.type}</span><h2 className={detailProject.title === '重生之亡妻回忆录' ? 'title-compact' : ''}>{detailProject.title}</h2><p>{detailProject.subtitle}{detailProject.highlight && <><br /><strong>{detailProject.highlight}</strong></>}</p>{!detailProject.slides && !['01','02','03'].includes(detailProject.id) && <p className="detail-pending">完整创作背景、角色职责、制作过程和视频链接将在资料补充后添加。</p>}<div className="detail-links">{detailProject.href?<a href={detailProject.href} target="_blank" rel="noreferrer">WATCH VIDEO ↗</a>:<span>VIDEO LINK TO ADD</span>}</div></div>
          {detailProject.orbitalGallery && detailImages.length > 1 ? <DetailOrbitGallery images={detailImages} title={detailProject.title} /> : <div className="detail-carousel">
            <button className={`detail-visual ${detailProject.tone ?? ''}`} type="button" onPointerDown={(event) => { detailDragRef.current = event.clientX; event.currentTarget.setPointerCapture(event.pointerId); }} onPointerUp={handleDetailPointerUp} aria-label={detailImages.length > 1 ? '左右滑动或点击海报两侧查看下一张' : `${detailProject.title} 海报`}>
              {detailImages.length > 0 ? <img key={detailImages[detailSlide]} src={detailImages[detailSlide]} alt={`${detailProject.title} 海报 ${detailSlide + 1}`} /> : <Artwork project={detailProject} />}
            </button>
            {detailImages.length > 1 && <div className="detail-gallery-controls"><span>{String(detailSlide + 1).padStart(2,'0')} / {String(detailImages.length).padStart(2,'0')}</span><div><button type="button" onClick={() => shiftDetail(-1)} aria-label="上一张海报">←</button><button type="button" onClick={() => shiftDetail(1)} aria-label="下一张海报">→</button></div></div>}
          </div>}
          {(detailProject.slides || detailProject.id === '01') && <a className="detail-scroll-arrow" href={detailProject.id === '01' ? '#project-copy-01' : `#project-slides-${detailProject.id}`} aria-label="向下查看作品介绍"><span>向下查看作品介绍</span><b aria-hidden="true">↓</b></a>}
        </div>
        {detailProject.id === '01' && <RebornWifeDetail />}
        {detailProject.slides && <div className="project-slide-stack" id={`project-slides-${detailProject.id}`}>
          {detailProject.slides.map((slide,index)=><figure className="project-slide" key={slide.src}>
            <img src={slide.src} alt={`${detailProject.title} 作品介绍 ${index+1}`} />
          </figure>)}
        </div>}
      </section>}
      {(indexOpen||contactOpen||selectedProject!==null)&&<button className="scrim" aria-label="关闭弹层" type="button" onClick={()=>{setIndexOpen(false);setContactOpen(false);setSelectedProject(null)}} />}
    </main>
  );
}
