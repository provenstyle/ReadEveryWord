import { setup, Preview } from "@storybook/vue3";
import vuetify from "../src/plugins/vuetify"

setup((app) => {
  app.use(vuetify)
})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
