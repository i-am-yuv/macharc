import { DatepickerComponent, DatepickerModule } from '@splenta/vezo/datepicker';
import { Story, Meta, moduleMetadata } from '@storybook/angular';

export default {
    title: '@splenta/vezo/datepicker',
    component: DatepickerComponent,
    decorators: [
        moduleMetadata({
            imports: [DatepickerModule],
        }),
    ],
} as Meta;

const Template: Story<DatepickerComponent> = (args: DatepickerComponent) => ({
    props: args,
});

export const Default = Template.bind({});

Default.args = {} as Partial<DatepickerComponent>;