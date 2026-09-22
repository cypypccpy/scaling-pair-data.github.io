const tocRoot = document.getElementById("toc");
const sections = Array.from(document.querySelectorAll("[data-toc]"));
const modal = document.getElementById("video-modal");
const modalTitle = document.getElementById("video-modal-title");
const modalPlayer = document.getElementById("video-modal-player");
const videoCarousels = Array.from(document.querySelectorAll("[data-video-carousel]"));
const langButtons = Array.from(document.querySelectorAll(".js-lang-toggle"));
const architectureImage = document.querySelector(".architecture-embed");
const architectureAltZh = architectureImage?.alt || "";

const englishCopy = {
  "hero-lead": "Data is essential to embodied intelligence, but how should we scale it, and which data deserves to be scaled? With Psi-R2.5, continued cleaning and refinement of human data has helped us identify the data and properties that matter most, and has changed how we think about model training. Here is our recent progress from the perspective of data.",
  read: "Start reading",
  watch: "Play Hero Clip",
  play: "Play",
  "diagram-alt": "The two-level Psi-R2.5 architecture: the high-level planner (Vision Language Model) sends Subtext and Value to the low-level controller (World Action Model), which interacts with the environment through Action and learns from Feedback.",
  "multitask-caption": "Psi-R2.5 multi-task evaluation",
  "icl-caption": "Psi-R2.5 In-Context Learning demonstrations · Select a thumbnail to switch videos",
  "icl-current-label": "Now showing",
  "postrl-caption": "Generalization across 3C-box assembly, long-horizon tasks, and dexterous manipulation · Click any video to enlarge",
  "weak-pair-title": "Weak Pair Data",
  "strong-pair-title": "Strong Pair Data",
  "weak-pair-description": "Paired by task semantics",
  "strong-pair-description": "Aligned scenes and frame-by-frame correspondence",
  "pair-human": "Human data",
  "pair-robot": "Robot data",
  "pair-comparison-caption": "Weak and strong pair data · Click either video to enlarge",
  "multi-pair-caption": "High-quality robot–human paired videos · Click any video to enlarge",
  "human-to-robot-caption": "Simply record a human manipulation video with a phone in an everyday setting, and our model can convert it into corresponding robot data.",
  r25: {
    paragraphs: [
      "Our latest model, R2.5, uses a two-level architecture. The upper level uses QwenVL3.5-4B as its backbone, with further pretraining on data we collected ourselves. It breaks a long instruction into the corresponding subtasks and provides meta-context, including memory and soft prompts, as well as value in the reinforcement-learning sense. These outputs, together with the current observation, are fed into the lower-level model, which produces the robot's concrete manipulation trajectories. The lower level uses Wan2.2-IT2V-5B as its backbone, also with further pretraining on our own data. Compared with R2, the most significant improvements in R2.5 are better data quality and the compression of data properties. After accumulating 100,000 hours, we conducted a comprehensive review of the entire dataset rather than continuing to add hours indiscriminately, identifying 100,000 hours of truly high-quality data. We substantially compressed redundant information in the data, improved human-to-robot data conversion by scaling up strong pair data, and refined both qualitative and quantitative assessments of data quality. Evaluation is also becoming increasingly important for foundation models. We introduced simulation-based evaluation during training of both the high-level and low-level models, included simulation data as part of the pretraining tasks, and evaluated the models directly in simulation in a zero-shot setting. To assess the final model, we also established a real-robot benchmark comprising 50 complex tasks and continually randomize each task's initial state during evaluation. Our aim is to provide a high-quality benchmark for compositional generalization.",
      "For embodied pretraining models, architecture is not the deciding factor: architectures evolve quickly, and one can be replaced in two or three days. Data determines the model's performance ceiling. Because embodied data spans many modalities, it is much harder to clean than other types of data. If all raw data is simply mixed together for training, the model implicitly learns a classifier that first distinguishes human demonstrations from real-robot data, then invokes the corresponding parameters for inference. This brings us to the central challenge in using human demonstrations: how can we get a model to understand them from the robot's perspective? R2.5 improves on two fronts: we use strong pair data to align human and robot data, and we demand greater precision in language annotations. For the first, many existing works explicitly pair human and robot demonstrations of similar tasks, such as picking up the same bottle of cola, and feed them into the model together in the hope of learning correspondences between the two. Such examples are called pair data. In R2 and W0, released in April, we used reinforcement learning within a world model to explicitly convert human data into corresponding robot data. This pipeline produces robot data with actions whose successful trajectories can be replayed directly on a robot, but the overall process is complex. We call a pair strong when the images are essentially identical apart from the embodiment, every frame corresponds in time, and the actions can be replayed directly on a robot. Data collected only according to the same task semantics is weak pair data. Strong pair data effectively brings human dynamics into the same domain as robot dynamics, and this alignment is scalable. Previously, high-quality strong pairs were extremely difficult to collect, and almost all available pairs were weak, making such direct alignment impractical. To produce strong pairs more efficiently, we first generated a large amount of high-quality strong pair data using R2 and W0, then trained an end-to-end data conversion model that directly maps human data to its strongly paired robot counterpart. We explain the implementation in detail in a later section. Beyond pair data, another important data property is the precision of language annotations. All our data is annotated through our data pipeline, with every decomposed atomic task described in as much detail as possible. We also set a very high bar for task diversity. We minimize the amount of data collected for each individual task and use our data collection operations to ensure diversity. Duration alone often says little about information content: 10,000 hours covering 100 tasks, with 100 hours per task, may contain no more information than 100 hours covering the same 100 tasks, with one hour per task. We therefore rigorously compress redundant data within a given number of hours, collect as many distinct tasks as possible, and carefully annotate and review each atomic action to ensure data quality.",
      "Embodied intelligence cannot be built overnight. We expect pretraining and post-training to coexist and complement one another over the long term. Pretraining aims to establish a foundation of general capabilities, reducing the amount of data and the cost needed to adapt to downstream tasks. This is central to its commercial value compared with traditional automation. Yet deploying a pretrained model directly at a customer site remains difficult in the near term: the SKUs and cycle times involved in on-site operations are highly customized, and general-purpose data cannot directly cover these requirements. Post-training therefore remains an indispensable link between foundation models and real-world settings for the foreseeable future, completing the cycle of capability development together with pretraining. We have developed a dexterous-hand post-training framework combining human-in-the-loop (HIL) learning and reinforcement learning (RL). Starting from our foundation model, it can learn complex tasks through fine-tuning with very little data, while collecting failures in real time during deployment and feeding them back to improve the model. Consider phone-box assembly, a task with many steps and stringent precision requirements. Training from scratch with imitation learning yields a relatively low success rate. With our HIL and post-training RL framework, several iterations can raise the success rate to 99% in just one or two working days. We have also deployed this approach at customer sites to address a range of complex corner cases."
    ],
    placeholders: []
  },
  "pair-data": {
    paragraphs: [
      "Human data has recently become a major focus of research. The central questions are how to raise its quality to the level of real-robot data and how to align it with robot data. Human data has long been considered useful only for pretraining. Most work in this area begins with large-scale pretraining on human data, followed by post-training on real-robot data to complete tasks. But indiscriminately feeding human data into a model is a crude approach. For a fixed evaluation environment, once a model has been trained on high-quality data, adding lower-quality data can actually be harmful: the noise it introduces outweighs the information it provides, reducing overall performance. Most methods that directly include human data in pretraining struggle to address this issue, because human data has a much lower signal-to-noise ratio than real-robot data. If human demonstrations collected for a task cannot even train a model that completes it, how can we ensure that including those demonstrations in training will meaningfully improve performance on that task? Consequently, most pretraining on human data offers only high-level guidance and contributes little to actual robot manipulation, even though filling the gap in manipulation data is central to embodied intelligence. This reasoning is similar to the motivation behind much of the work on zero-shot Sim2Real. Researchers often choose zero-shot rather than few-shot transfer to validate the effectiveness of simulation: if a model trained entirely on simulated data performs poorly, the data quality or simulator parameters are likely at fault. The same applies to human data. Human data that can directly train a capable model is the highest-quality human data, and it is what we want to use for pretraining. We therefore believe that a method for analyzing the effectiveness and quality of human data is essential to human-data pretraining. We developed two tests: first, replay the processed trajectories directly on a robot to check whether they complete the same task; second, use the processed data for post-training and check whether the resulting model generalizes to related tasks. Our data converter, trained on strong pair data, directly converts human data into aligned robot data and performs well on both tests. Below, we review existing approaches to post-training with human data and explain how we achieve this with strong pair data.",
      "Although still limited in number, relevant studies are gradually emerging in academia. Similar to the sim-to-real gap, the embodiment gap encountered when training solely on human data can be divided into two specific gaps:",
      "Almost all methods that train solely on human data center on resolving these two problems. Some existing approaches use real2sim to reconstruct human data in a simulator, train a model through trajectory optimization or reinforcement learning, then transfer it directly through sim2real. This approach grew out of earlier Sim2Real research, but it faces two problems: real2sim itself is difficult to scale, and the sim-to-real gap remains. Other work uses the simulator to process data and address the embodiment gap, rather than training a model in simulation and transferring it through sim2real. For the Visual Embodiment Gap, the usual pipeline performs segmentation, applies inpainting, then overlays a rendered robot. For the Dynamic Embodiment Gap, trajectory optimization or reinforcement learning is applied as above, producing better data for training a policy. The key difference is that this second approach uses simulation for data processing and then trains a visuomotor policy through imitation learning, rather than training a model directly in simulation and transferring it through sim2real. However, it still faces the difficulty of scaling real2sim, while its inpainting-based visual processing pipeline has inherent limitations in handling complex relationships such as occlusion. For example, some methods can replace human hands with robot hands, but limitations in depth estimation mean that current sensors cannot resolve the occlusion relationships between fingers and objects. The resulting images therefore retain visual interpenetration artifacts. Yet these interactions are precisely the information that matters most to the model.",
      "These limitations have long confined this direction to relatively simple, customized tasks, leading many to believe that human data alone cannot train models for complex manipulation. Our team began exploring this direction very early and has tried essentially every approach. We eventually replaced the simulator with a world model. Pretrained on human data at the scale of 100,000 hours, our Psi-W0 can serve the role of the simulator in the approaches above. Reinforcement learning in this world-model simulator optimizes a human-hand trajectory into an executable robot trajectory, converting human data into robot data.",
      "This approach follows the same underlying idea, but replaces a conventional simulator with a world model, allowing us to sidestep the sim-to-real and scaling difficulties described above. That solves part of the problem, but the pipeline remains heavy: it requires the policy and world model to roll out together, as well as reinforcement learning for fine-tuning. We therefore collect the strong pair data converted by Psi-W0 and distill the entire process into a model that directly aligns and converts human data into robot data. Even this is relatively slow. We then realized that the difficulty of this pipeline, and earlier approaches, comes from having to create corresponding robot data from scratch for an existing human trajectory, which requires reinforcement learning, trajectory optimization, or similar methods to reduce the embodiment gap. But why not reverse the process: start with existing robot data and generate the corresponding human data? Both the visuals and dynamics of real-robot data are already directly usable. If we can obtain a large amount of human data matched to real-robot data, we can train a model that takes human-hand data as input and outputs the corresponding robot images and actions, enabling models to be trained solely with human data. Following this reverse perspective, we use Psi-W0 in the opposite direction: starting from real-robot data, we generate the corresponding human-hand data and directly produce high-quality pair data.",
      "With these pairs, we can train an end-to-end human-to-robot data conversion model that also produces actions, directly aligning human data with robot data. We validate the converted data with the two tests described above to establish the approach's feasibility. Our results show that human data converted by the model can be replayed directly on a robot or used to train a model. Even for particularly complex tasks that cannot be completed directly, the trajectories of both hands are generally close to the required motion. This is because the model performs video editing with actions rather than acting as a policy; combined with the robot's limited action space, this makes zero-shot generalization easier to achieve. The model now generalizes well enough that anyone can record a human manipulation video with their own phone or camera and use our pipeline to convert it into data for a range of robots. The video below, for example, shows the result of converting footage we recorded with our own phone in an arbitrary setting. Both the visual reconstruction fidelity and physical consistency are strong, allowing us to make better use of the diversity of egocentric data."
    ],
    gaps: [
      "Whether people wear gloves or use bare hands, human data can look very different from the observations a robot receives at inference time. These differences extend beyond the pixels of human hands and robots to camera parameters and changes in the environment.",
      "In human data, people manipulate objects with their hands, and actions are usually obtained through devices or vision algorithms. Compared with data recorded directly from a robot, this introduces three types of error: sensor or visual estimation errors in hand-pose tracking, kinematic errors due to differences between human and robot joints, and mismatches between human and robot physical properties, such as friction."
    ],
    placeholders: []
  },
  icl: {
    paragraphs: [
      "A new idea has recently attracted widespread attention: without retraining or fine-tuning a model, let a person demonstrate a task once, then feed the recorded trajectory into the model as a prompt to guide a robot through tasks it previously struggled to complete. This is the basic idea behind the increasingly popular approaches of In-Context Learning (ICL) and Test-Time Training. The underlying logic is that training a general-purpose model to perform any task anywhere is extremely difficult, while training a model to complete a task after seeing a single demonstration is relatively easier. Unlike the context used by large language models, context in robotics takes the form of a human demonstration video, rather than a video demonstrating the robot itself. With our powerful pair data model, human data can be efficiently converted into corresponding robot data, providing a prompt in a form better suited to the model. This allows us to readily achieve efficient in-context learning. As the videos below show, ICL enables a robot to generalize to new tasks in a zero-shot setting from context, without updating any model parameters. Rather than retraining for each new task, the robot can infer what to do and how to do it from text prompts or physical prompts alone. We will share more technical details about ICL in a future release."
    ],
    placeholders: []
  },
  closing: {
    paragraphs: [
      "If you are interested in collaborating, please reach out. We are especially interested in working with companies that are continuing to scale up their data collection.",
      "We are also hiring. If you would like to join us, we would love to hear from you.",
      "If you are interested in our work, potential collaborations, or any other questions, please write to market@psirobot.ai."
    ],
    placeholders: []
  }
};

const translatedElements = [];

document.querySelectorAll("[data-i18n]").forEach((element) => {
  translatedElements.push({ element, zh: element.textContent.trim(), en: englishCopy[element.dataset.i18n] });
});

for (const sectionId of ["r25", "pair-data", "icl", "closing"]) {
  const section = document.getElementById(sectionId);
  const copy = englishCopy[sectionId];
  const paragraphs = section.querySelectorAll(".section-copy > p:not(.kicker)");
  const gaps = section.querySelectorAll(".gap-list span");
  const placeholders = section.querySelectorAll(".media-placeholder > span:last-child");

  for (const [elements, translations] of [
    [paragraphs, copy.paragraphs],
    [gaps, copy.gaps || []],
    [placeholders, copy.placeholders]
  ]) {
    if (elements.length !== translations.length) {
      throw new Error(`Translation count mismatch in ${sectionId}`);
    }
    elements.forEach((element, index) => {
      translatedElements.push({ element, zh: element.textContent.trim(), en: translations[index] });
    });
  }
}

const placeholderLabels = { "效果占位": "Demo pending", "展示占位": "Media pending", "对比占位": "Comparison pending", "视频占位": "Video pending" };
document.querySelectorAll(".media-placeholder-label").forEach((element) => {
  translatedElements.push({ element, zh: element.textContent.trim(), en: placeholderLabels[element.textContent.trim()] });
});

let activeCarousel = null;

function buildToc() {
  if (!tocRoot) return;

  sections.forEach((section) => {
    const id = section.id;
    const label = section.dataset.toc;
    if (!id || !label) return;

    const link = document.createElement("a");
    link.href = `#${id}`;
    link.textContent = label;
    tocRoot.appendChild(link);
  });
}

function updateActiveToc() {
  if (!tocRoot) return;

  const links = Array.from(tocRoot.querySelectorAll("a"));
  if (!links.length) return;

  let currentId = sections[0]?.id;
  const threshold = window.innerHeight * 0.24;

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= threshold) {
      currentId = section.id;
    }
  });

  links.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${currentId}`);
  });
}

let activeVideoTrigger = null;
let pausedGalleryVideos = [];
let iclShowcase = null;

function openVideo(src, title, trigger) {
  if (!src || !modal || !modalPlayer) return;

  activeVideoTrigger = trigger || document.activeElement;
  pausedGalleryVideos = Array.from(document.querySelectorAll(".postrl-gallery video, .pair-comparison video, .multi-pair-gallery video, .human-to-robot-demo video, #icl-player"))
    .filter((video) => !video.paused);
  modal.classList.add("is-open");
  iclShowcase?.refreshPlayback();
  pausedGalleryVideos.forEach((video) => video.pause());
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  modalTitle.textContent = title || "Demo Video";
  const preview = trigger?.querySelector("video");
  const aspect = preview?.videoWidth && preview.videoHeight
    ? preview.videoWidth / preview.videoHeight
    : 16 / 9;
  modal.style.setProperty("--video-aspect", aspect);
  modalPlayer.loop = Boolean(trigger?.querySelector("video[loop]"));
  modalPlayer.muted = modalPlayer.loop;
  modalPlayer.src = src;
  modalPlayer.play().catch(() => {});
  document.querySelector(".page-shell").inert = true;
  modal.querySelector(".video-modal-close").focus();
}

function closeVideo() {
  if (!modal || !modalPlayer) return;

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  modalPlayer.pause();
  modalPlayer.removeAttribute("src");
  modalPlayer.load();
  document.querySelector(".page-shell").inert = false;
  activeVideoTrigger?.focus({ preventScroll: true });
  activeVideoTrigger = null;
  pausedGalleryVideos.forEach((video) => {
    if (video !== iclShowcase?.player) video.play().catch(() => {});
  });
  iclShowcase?.refreshPlayback();
  pausedGalleryVideos = [];
}

function wireVideos() {
  const openButtons = Array.from(document.querySelectorAll(".js-open-video"));

  modalPlayer.addEventListener("loadedmetadata", () => {
    if (modalPlayer.videoWidth && modalPlayer.videoHeight) {
      modal.style.setProperty("--video-aspect", modalPlayer.videoWidth / modalPlayer.videoHeight);
    }
  });

  openButtons.forEach((button) => {
    if (!button.getAttribute("aria-label")) {
      button.setAttribute("aria-label", button.dataset.videoTitle || "打开演示视频");
    }

    button.addEventListener("click", () => {
      openVideo(button.dataset.videoSrc, button.dataset.videoTitle, button);
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", closeVideo);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal?.classList.contains("is-open")) {
      closeVideo();
    }
  });
}

function isVisible(element) {
  return Boolean(element && (element.offsetWidth || element.offsetHeight || element.getClientRects().length));
}

function syncCarouselVideo(video, shouldPlay) {
  if (!video) return;

  if (shouldPlay) {
    video.play().catch(() => {});
    return;
  }

  video.pause();
  video.currentTime = 0;
}

function buildVideoCarousel(carousel) {
  const base = carousel.dataset.videoBase;
  const count = Number(carousel.dataset.videoCount || 0);

  if (!base || !Number.isFinite(count) || count <= 0) {
    return;
  }

  const viewport = document.createElement("div");
  viewport.className = "video-carousel-viewport";

  const track = document.createElement("div");
  track.className = "video-carousel-track";

  const slides = [];

  for (let index = 1; index <= count; index += 1) {
    const slide = document.createElement("figure");
    slide.className = "video-slide";

    const video = document.createElement("video");
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "metadata";

    const source = document.createElement("source");
    source.src = `${base}/${index}.mp4`;
    source.type = "video/mp4";

    video.appendChild(source);
    slide.appendChild(video);
    track.appendChild(slide);
    slides.push(slide);
  }

  viewport.appendChild(track);

  const controls = document.createElement("div");
  controls.className = "video-carousel-controls";

  const prev = document.createElement("button");
  prev.className = "video-carousel-arrow";
  prev.type = "button";
  prev.setAttribute("aria-label", "上一个 Pair Data 视频");
  prev.innerHTML = "<span>&larr;</span>";

  const status = document.createElement("div");
  status.className = "video-carousel-status";

  const next = document.createElement("button");
  next.className = "video-carousel-arrow";
  next.type = "button";
  next.setAttribute("aria-label", "下一个 Pair Data 视频");
  next.innerHTML = "<span>&rarr;</span>";

  controls.append(prev, status, next);
  carousel.append(viewport, controls);

  let currentIndex = 0;

  const applyAspectRatio = (video) => {
    if (!video || !video.videoWidth || !video.videoHeight) return;
    viewport.style.setProperty("--carousel-aspect", `${video.videoWidth} / ${video.videoHeight}`);
  };

  const refreshPlayback = () => {
    slides.forEach((slide, slideIndex) => {
      const video = slide.querySelector("video");
      const isCurrent = slideIndex === currentIndex && isVisible(carousel);

      if (isCurrent) {
        applyAspectRatio(video);
      }

      syncCarouselVideo(video, isCurrent);
    });
  };

  const setIndex = (nextIndex) => {
    if (!slides.length) return;

    if (nextIndex < 0) {
      currentIndex = slides.length - 1;
    } else if (nextIndex >= slides.length) {
      currentIndex = 0;
    } else {
      currentIndex = nextIndex;
    }

    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    status.textContent = `${currentIndex + 1} / ${slides.length}`;
    refreshPlayback();
  };

  carousel.__setIndex = setIndex;
  carousel.__getIndex = () => currentIndex;
  carousel.__refresh = refreshPlayback;

  prev.addEventListener("click", () => {
    activeCarousel = carousel;
    setIndex(currentIndex - 1);
  });

  next.addEventListener("click", () => {
    activeCarousel = carousel;
    setIndex(currentIndex + 1);
  });

  ["mouseenter", "focusin", "click"].forEach((eventName) => {
    carousel.addEventListener(eventName, () => {
      activeCarousel = carousel;
    });
  });

  slides.forEach((slide) => {
    const video = slide.querySelector("video");
    if (!video) return;

    video.addEventListener("loadedmetadata", () => {
      if (slide === slides[currentIndex]) {
        applyAspectRatio(video);
      }
    });
  });

  setIndex(0);
}

function wireCarouselKeyboard() {
  if (!videoCarousels.length) return;

  document.addEventListener("keydown", (event) => {
    if (modal?.classList.contains("is-open")) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    const target = event.target;
    if (
      target instanceof HTMLElement &&
      (target.isContentEditable ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT")
    ) {
      return;
    }

    const carousel =
      (activeCarousel && isVisible(activeCarousel) && activeCarousel) ||
      videoCarousels.find((candidate) => isVisible(candidate));

    if (!carousel || typeof carousel.__setIndex !== "function") return;

    event.preventDefault();
    const delta = event.key === "ArrowLeft" ? -1 : 1;
    carousel.__setIndex(carousel.__getIndex() + delta);
    carousel.focus();
  });
}

function initVideoCarousels() {
  videoCarousels.forEach((carousel, index) => {
    buildVideoCarousel(carousel);
    if (index === 0) {
      activeCarousel = carousel;
    }
  });

  wireCarouselKeyboard();
}

function initIclShowcase() {
  const showcase = document.querySelector("[data-icl-carousel]");
  const player = showcase?.querySelector("#icl-player");
  const thumbnails = Array.from(showcase?.querySelectorAll(".icl-thumbnail") || []);
  if (!player || !thumbnails.length) return;

  const previous = showcase.querySelector("[data-icl-prev]");
  const next = showcase.querySelector("[data-icl-next]");
  const position = showcase.querySelector("#icl-position");
  const thumbnailGroup = showcase.querySelector(".icl-thumbnails");
  let currentIndex = 0;
  let inViewport = false;
  let wantsPlayback = true;
  let language = "zh";

  // Start playback when the showcase enters view, while preserving native pauses.
  player.autoplay = false;
  player.loop = false;
  player.pause();

  const canPlay = () => inViewport && !document.hidden && !modal?.classList.contains("is-open");
  const number = (index) => String(index + 1).padStart(2, "0");

  const pauseAutomatically = () => {
    if (!player.paused) player.pause();
  };

  const updateLanguage = (lang) => {
    language = lang;
    const english = lang === "en";
    previous?.setAttribute("aria-label", english ? "Previous ICL video" : "上一个 ICL 视频");
    next?.setAttribute("aria-label", english ? "Next ICL video" : "下一个 ICL 视频");
    thumbnailGroup?.setAttribute("aria-label", english ? "Choose an ICL demonstration" : "选择 ICL 演示视频");
    player.setAttribute("aria-label", english
      ? `ICL demonstration ${number(currentIndex)} of ${thumbnails.length}`
      : `ICL 演示 ${number(currentIndex)}，共 ${thumbnails.length} 个视频`);
    thumbnails.forEach((thumbnail, index) => {
      thumbnail.setAttribute("aria-label", english ? `Play Demo ${number(index)}` : `播放演示 ${number(index)}`);
    });
  };

  const updateSelection = () => {
    thumbnails.forEach((thumbnail, index) => {
      const selected = index === currentIndex;
      thumbnail.classList.toggle("is-active", selected);
      thumbnail.setAttribute("aria-pressed", String(selected));
      thumbnail.style.setProperty("--icl-progress", "0");
    });
    if (position) position.textContent = `${number(currentIndex)} / ${String(thumbnails.length).padStart(2, "0")}`;
    updateLanguage(language);
  };

  const refreshPlayback = () => {
    if (!canPlay()) {
      pauseAutomatically();
    } else if (wantsPlayback) {
      if (player.ended) selectVideo(currentIndex + 1);
      else player.play().catch(() => {});
    }
  };

  const selectVideo = (index) => {
    const selected = (index + thumbnails.length) % thumbnails.length;
    if (selected === currentIndex) return;

    pauseAutomatically();
    currentIndex = selected;
    wantsPlayback = true;
    const thumbnail = thumbnails[currentIndex];
    player.poster = thumbnail.dataset.iclPoster;
    player.src = thumbnail.dataset.iclSrc;
    player.load();
    updateSelection();
    refreshPlayback();
  };

  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener("click", () => selectVideo(index));
  });
  previous?.addEventListener("click", () => selectVideo(currentIndex - 1));
  next?.addEventListener("click", () => selectVideo(currentIndex + 1));

  showcase.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    if (!(event.target instanceof Element)) return;
    const control = event.target.closest(".icl-thumbnail, [data-icl-prev], [data-icl-next]");
    if (!control || !showcase.contains(control)) return;

    event.preventDefault();
    selectVideo(currentIndex + (event.key === "ArrowLeft" ? -1 : 1));
    if (control.matches(".icl-thumbnail")) thumbnails[currentIndex].focus({ preventScroll: true });
  });

  player.addEventListener("play", () => {
    if (!canPlay()) pauseAutomatically();
    else wantsPlayback = true;
  });
  player.addEventListener("pause", () => {
    // Loading another source can discard queued pause events. Read the current
    // playback state instead of counting events from earlier sources.
    if (player.paused && canPlay() && !player.ended) wantsPlayback = false;
  });
  player.addEventListener("timeupdate", () => {
    const progress = Number.isFinite(player.duration) && player.duration > 0
      ? Math.min(1, player.currentTime / player.duration)
      : 0;
    thumbnails[currentIndex].style.setProperty("--icl-progress", String(progress));
  });
  player.addEventListener("ended", () => {
    wantsPlayback = true;
    if (canPlay()) selectVideo(currentIndex + 1);
  });

  const observer = new IntersectionObserver(([entry]) => {
    inViewport = entry.isIntersecting;
    refreshPlayback();
  });
  observer.observe(player);
  document.addEventListener("visibilitychange", refreshPlayback);

  updateSelection();
  iclShowcase = { player, refreshPlayback, updateLanguage };
}

function setLanguage(lang) {
  translatedElements.forEach(({ element, zh, en }) => {
    element.textContent = lang === "en" ? en : zh;
  });

  document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
  if (architectureImage) {
    architectureImage.alt = lang === "en" ? englishCopy["diagram-alt"] : architectureAltZh;
  }
  document.querySelectorAll(".js-open-video").forEach((button) => {
    const title = lang === "en"
      ? button.dataset.videoTitleEn || "Demo video"
      : button.dataset.videoTitleZh || "已有演示";
    button.dataset.videoTitle = title;
    button.setAttribute("aria-label", lang === "en" ? `Open video: ${title}` : `放大查看：${title}`);
  });
  const closeButton = document.querySelector(".video-modal-close");
  closeButton.textContent = lang === "en" ? "Close" : "关闭";
  closeButton.setAttribute("aria-label", lang === "en" ? "Close video" : "关闭视频");
  if (!modal?.classList.contains("is-open")) {
    modalTitle.textContent = lang === "en" ? "Demo video" : "演示视频";
  }

  langButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.targetLang === lang);
    button.setAttribute(
      "aria-pressed",
      button.dataset.targetLang === lang ? "true" : "false"
    );
  });

  window.localStorage.setItem("website_pair_data_lang", lang);
  iclShowcase?.updateLanguage(lang);

  videoCarousels.forEach((carousel) => {
    if (typeof carousel.__refresh === "function") {
      carousel.__refresh();
    }
  });
}

function wireLanguageToggle() {
  if (!langButtons.length) return;

  const storedLang = window.localStorage.getItem("website_pair_data_lang");
  const initialLang = storedLang === "en" ? "en" : "zh";
  setLanguage(initialLang);

  langButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setLanguage(button.dataset.targetLang);
    });
  });
}

buildToc();
updateActiveToc();
initVideoCarousels();
initIclShowcase();
wireVideos();
wireLanguageToggle();

window.addEventListener("scroll", updateActiveToc, { passive: true });
window.addEventListener("resize", () => {
  videoCarousels.forEach((carousel) => {
    if (typeof carousel.__refresh === "function") {
      carousel.__refresh();
    }
  });
});
