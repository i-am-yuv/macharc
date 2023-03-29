import { TextareaComponent, TextareaModule } from '@splenta/vezo/textarea';
import { Story, Meta, moduleMetadata } from '@storybook/angular';

export default {
    title: '@splenta/vezo/textarea',
    component: TextareaComponent,
    decorators: [
        moduleMetadata({
            imports: [TextareaModule],
        }),
    ],
} as Meta;

const Template: Story<TextareaComponent> = (args: TextareaComponent) => ({
    props: args,
});

export const Default = Template.bind({});

Default.args = {} as Partial<TextareaComponent>;