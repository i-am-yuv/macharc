import { ButtonComponent, ButtonModule } from '@splenta/vezo/button';
import { Story, Meta, moduleMetadata } from '@storybook/angular';

export default {
    title: '@splenta/vezo/button',
    component: ButtonComponent,
    decorators: [
        moduleMetadata({
            imports: [ButtonModule],
        }),
    ],
} as Meta;

const Template: Story<ButtonComponent> = (args: ButtonComponent) => ({
    props: args,
});

export const Default = Template.bind({});

Default.args = {} as Partial<ButtonComponent>;