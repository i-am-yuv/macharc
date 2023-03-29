import '!style-loader!css-loader!sass-loader!../projects/splenta/vezo/src/styles/vezo-theme.css';
import { setCompodocJson } from "@storybook/addon-docs/angular";
import docJson from "../documentation.json";
setCompodocJson(docJson);

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  // docs: { inlineStories: true },
}