import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
    {
        path: 'tabs',
        component: TabsPage,
        children: [
            {
                path: 'map',
                children: [
                    {
                        path: '',
                        loadChildren:
                            '../tab-map/tab-map.module#TabMapPageModule'
                    }
                ]
            },

            {
                path: 'saved',
                children: [
                    {
                        path: '',
                        loadChildren:
                            '../tab-saved/tab-saved.module#TabSavedPageModule'
                    }
                ]
            },
            {
                path: 'tab1',
                children: [
                    {
                        path: '',
                        loadChildren: '../tab1/tab1.module#Tab1PageModule'
                    }
                ]
            },
            {
                path: 'info',
                children: [
                    {
                        path: '',
                        loadChildren:
                            '../tab-info/tab-info.module#TabInfoPageModule'
                    }
                ]
            },
            {
                path: '',
                redirectTo: '/tabs/map',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/tabs/map',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TabsPageRoutingModule {}
