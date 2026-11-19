export const siteConfig = {
  name: "Ayaan Khan",
  title: "Ayaan Khan — Software Developer",
  description:
    "Ayaan Khan is a software developer building thoughtful digital experiences, useful products, and interfaces with a little personality.",
  // Production origin supplied for this portfolio deployment.
  siteUrl: "https://ayaan-portfolio-mu.vercel.app",
  email: "ayaankhan96438@gmail.com",
  github: "https://github.com/ayaankhan96438-star",
  linkedin: "https://www.linkedin.com/in/ayaan-khan-b23a7a440",
  // Set to "/resume.pdf" only after adding a real file at public/resume.pdf.
  resumeUrl: "",
} as const;

export const siteUrl = siteConfig.siteUrl;
export const email = siteConfig.email;
export const github = siteConfig.github;
export const linkedin = siteConfig.linkedin;
