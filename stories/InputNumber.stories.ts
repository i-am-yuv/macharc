import { InputnumberComponent, InputnumberModule } from '@splenta/vezo/inputnumber';
import { Story, Meta, moduleMetadata } from '@storybook/angular';

export default {
    title: '@splenta/vezo/inputnumber',
    component: InputnumberComponent,
    decorators: [
        moduleMetadata({
            imports: [InputnumberModule],
        }),
    ],
} as Meta;

const Template: Story<InputnumberComponent> = (args: InputnumberComponent) => ({
    props: args,
});

export const Default = Template.bind({});

Default.args = {} as Partial<InputnumberComponent>;