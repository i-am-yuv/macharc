import { MenuComponent, MenuModule } from '@splenta/vezo/menu';
import { Story, Meta, moduleMetadata } from '@storybook/angular';

export default {
    title: '@splenta/vezo/menu',
    component: MenuComponent,
    decorators: [
        moduleMetadata({
            imports: [MenuModule],
        }),
    ],
} as Meta;
const menuItems: any[] = [
    {
        label: 'Builder',
        items: [
            { label: 'Projects', routerLink: ['/builder/projects'] },
            { label: 'Modules', routerLink: ['/builder/modules'] },
            { label: 'Collections', routerLink: ['/builder/collections'] },
            { label: 'Screens', routerLink: ['/builder/screens'] },
            { label: 'Widgets', routerLink: ['/builder/widgets'] },
            { label: 'Process', routerLink: ['/builder/processes'] },
            { label: 'Workflow', routerLink: ['/builder/workflows'] },
        ],
        showSubMenu: true
    },
    {
        label: 'Admin',
        items: [
            { label: 'ACL' },
            { label: 'Settings' }
        ],
        showSubMenu: true
    }
]
const Template: Story<MenuComponent> = (args: MenuComponent) => ({
    props: args,
});

export const Default = Template.bind({});

Default.args = { items: menuItems } as Partial<MenuComponent>;