import { ModalComponent, ModalModule } from '@splenta/vezo/modal';
import { Story, Meta, moduleMetadata } from '@storybook/angular';

export default {
    title: '@splenta/vezo/modal',
    component: ModalComponent,
    decorators: [
        moduleMetadata({
            imports: [ModalModule],
        }),
    ],
} as Meta;

const Template: Story<ModalComponent> = (args: ModalComponent) => ({
    // template: `<vezo-modal [visible]="true">
    //             <ng-template vTemplate="header">Title</ng-template>
    //            </vezo-modal>`,
    props: args,
});

export const Default = Template.bind({

});

Default.args = {} as Partial<ModalComponent>;