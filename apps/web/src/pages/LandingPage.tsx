import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Box,
  Flower2,
  Palette,
  PenLine,
  Sparkles,
} from 'lucide-react';
import { BrandMark } from '../components/BrandMark';
import { Button } from '../components/ui/Button';
import { assetUrl } from '../lib/assetUrl';

const features = [
  {
    icon: Box,
    title: '真实 GLB 器物',
    description: '加载原始紫砂壶模型，自由旋转、缩放与切换视角。',
  },
  {
    icon: Palette,
    title: '三种紫砂泥色',
    description: '紫泥、朱泥、段泥实时切换 PBR 材质，而非替换图片。',
  },
  {
    icon: PenLine,
    title: '贴合壶身的铭文',
    description: '文字以贴花投射落到曲面，随视角变化自然贴合。',
  },
  {
    icon: Flower2,
    title: '东方纹样贴花',
    description: '竹、梅、兰、荷等十种纹样，彩绘与雕刻双风格。',
  },
];

export default function LandingPage() {
  const reduceMotion = useReducedMotion();
  const fade = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <div className="min-h-screen bg-paper">
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <BrandMark />
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-brand/15 bg-surface/60 px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] text-secondary backdrop-blur sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Concept demo
            </span>
            <Link
              to="/studio"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-brand/20 bg-surface/80 px-4 text-[12px] font-medium text-brand shadow-sm backdrop-blur transition-all hover:border-brand/40 hover:bg-surface sm:px-5"
            >
              进入工作台
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative flex min-h-[100svh] items-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url("${assetUrl('/assets/backgrounds/hero.webp')}")` }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(247,243,236,0.96)_0%,rgba(247,243,236,0.82)_30%,rgba(247,243,236,0.32)_58%,rgba(247,243,236,0.05)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_55%_at_18%_48%,rgba(255,252,247,0.72),transparent_70%)]" />

          <div className="relative z-10 mx-auto w-full max-w-[1500px] px-5 pb-16 pt-28 sm:px-8 lg:px-12">
            <motion.div {...fade} className="max-w-[560px]">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-10 bg-brand/35" />
                <span className="text-[10px] uppercase tracking-[0.32em] text-brand/75">
                  WenCraft AI · 器物有言
                </span>
              </div>

              <h1 className="font-serif text-[clamp(54px,8vw,100px)] leading-[1.02] tracking-[0.12em] text-ink">
                器物有言
              </h1>
              <p className="mt-5 font-serif text-[clamp(20px,2.4vw,29px)] tracking-[0.16em] text-brand">
                让心意，成为可以珍藏的作品
              </p>
              <p className="mt-6 max-w-[470px] text-[13px] leading-[1.9] text-secondary sm:text-[14px]">
                以人工智能为笔，以传统器物为载体。将故事、祝福与灵感，融入每一件独一无二的作品。
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link to="/studio">
                  <Button
                    variant="primary"
                    size="lg"
                    trailingIcon={<ArrowRight className="h-4 w-4" />}
                    className="rounded-full px-7"
                  >
                    开始定制
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  size="lg"
                  className="rounded-full border-brand/15 bg-surface/65 px-7 backdrop-blur"
                  onClick={() =>
                    document
                      .getElementById('capabilities')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                >
                  了解核心能力
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] tracking-[0.08em] text-secondary/80">
                <span>真实 3D 交互</span>
                <span className="h-3 w-px bg-line" />
                <span>实时贴花定制</span>
                <span className="h-3 w-px bg-line" />
                <span>本地草稿保存</span>
              </div>
            </motion.div>

            <motion.div
              {...fade}
              transition={{
                duration: 0.9,
                delay: reduceMotion ? 0 : 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute bottom-10 right-8 hidden w-[260px] rounded-2xl border border-white/40 bg-surface/55 p-3.5 shadow-soft backdrop-blur-xl lg:block"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[9px] uppercase tracking-[0.2em] text-secondary/75">
                  Now in studio
                </span>
                <span className="flex items-center gap-1 text-[9px] text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Live
                </span>
              </div>
              <p className="mt-2 font-serif text-[17px] text-ink">
                经典紫砂壶 · 实时定制
              </p>
              <p className="mt-1 text-[10px] leading-relaxed text-secondary">
                紫泥 / 朱泥 / 段泥 · 铭文贴合 · 东方纹样
              </p>
              <Link
                to="/studio"
                className="mt-3 inline-flex items-center gap-1 text-[10px] font-medium text-brand transition-colors hover:text-brand-hover"
              >
                进入 3D 工作台
                <ArrowRight className="h-3 w-3" />
              </Link>
            </motion.div>
          </div>

          <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[9px] uppercase tracking-[0.28em] text-secondary/55 sm:flex">
            <span>Scroll</span>
            <span className="h-8 w-px bg-gradient-to-b from-brand/40 to-transparent" />
          </div>
        </section>

        <section
          id="capabilities"
          className="relative mx-auto max-w-[1300px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
        >
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-gold" />
                <span className="text-[10px] uppercase tracking-[0.28em] text-secondary/80">
                  Core interaction / 第一阶段
                </span>
              </div>
              <h2 className="mt-4 font-serif text-[clamp(28px,4vw,44px)] leading-tight tracking-[0.08em] text-ink">
                这一次，先把器物真正转起来
              </h2>
            </div>
            <p className="max-w-[430px] text-[12.5px] leading-[1.9] text-secondary">
              这一阶段聚焦 3D 紫砂壶定制工作台：真实模型、实时泥色、贴合铭文与纹样切换。所有交互都发生在浏览器里。
            </p>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.article
                  key={feature.title}
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group rounded-2xl border border-line/70 bg-surface/60 p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand/25 hover:bg-surface"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-brand/15 bg-brand/[0.05] text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="mt-5 font-serif text-[17px] tracking-[0.04em] text-ink">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-[11px] leading-[1.8] text-secondary">
                    {feature.description}
                  </p>
                </motion.article>
              );
            })}
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-2xl border border-brand/15 bg-[linear-gradient(120deg,rgba(128,84,60,0.08),rgba(176,138,84,0.04))] px-6 py-7 sm:flex-row sm:items-center sm:px-8">
            <div>
              <p className="font-serif text-[20px] tracking-[0.06em] text-ink">
                器物有言，心意有形。
              </p>
              <p className="mt-1.5 text-[11px] text-secondary">
                当前为概念演示，不接入真实支付、生产与物流。
              </p>
            </div>
            <Link to="/studio">
              <Button
                variant="primary"
                className="rounded-full px-6"
                trailingIcon={<ArrowRight className="h-4 w-4" />}
              >
                进入 3D 工作台
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-line/70 px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1300px] flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <BrandMark compact />
            <span className="text-[10px] text-secondary/75">
              器物有言 · WenCraft AI
            </span>
          </div>
          <p className="text-[9.5px] leading-relaxed text-secondary/65">
            概念演示网站 · 所有作品、价格、状态与流程均为演示数据
          </p>
        </div>
      </footer>
    </div>
  );
}
