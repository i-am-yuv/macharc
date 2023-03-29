import { InputComponent, InputModule } from '@splenta/vezo/input';
import { Story, Meta, moduleMetadata } from '@storybook/angular';

export default {
    title: '@splenta/vezo/input',
    component: InputComponent,
    decorators: [
        moduleMetadata({
            imports: [InputModule],
        }),
    ],
} as Meta;

const Template: Story<InputComponent> = (args: InputComponent) => ({
    props: args,
});

export const Default = Template.bind({});

Default.args = {} as Partial<InputComponent>;