import { TableComponent, TableModule } from '@splenta/vezo/table';
import { Story, Meta, moduleMetadata } from '@storybook/angular';

export default {
    title: '@splenta/vezo/table',
    component: TableComponent,
    decorators: [
        moduleMetadata({
            imports: [TableModule],
        }),
    ],
} as Meta;

const Template: Story<TableComponent> = (args: TableComponent) => ({
    props: args,
});

export const Default = Template.bind({});

Default.args = {} as Partial<TableComponent>;