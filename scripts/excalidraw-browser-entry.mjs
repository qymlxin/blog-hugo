import { exportScene } from "@excalidraw/utils";

window.renderExcalidraw = async (diagram, options = {}) => {
  const source = typeof diagram === "string" ? JSON.parse(diagram) : diagram;
  const elements = (source.elements || []).filter((element) => !element.isDeleted);
  const files = source.files || {};
  const svg = await exportScene({
    type: "svg",
    data: {
      elements,
      appState: source.appState || {},
      files,
    },
    config: {
      theme: options.dark ? "dark" : "light",
      canvasBackgroundColor: options.exportBackground === false ? false : options.background,
      embedScene: false,
      renderEmbeddables: true,
    },
  });

  svg.setAttribute("role", "img");
  if (options.alt) svg.setAttribute("aria-label", options.alt);
  return new XMLSerializer().serializeToString(svg);
};
