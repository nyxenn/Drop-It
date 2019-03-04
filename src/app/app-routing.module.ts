import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
    {
        path: 'tab-map',
        loadChildren: './tab-map/tab-map.module#TabMapPageModule'
    },
    {
        path: 'tab-info',
        loadChildren: './tab-info/tab-info.module#TabInfoPageModule'
    },
    {
        path: 'tab-profile',
        loadChildren: './tab-profile/tab-profile.module#TabProfilePageModule'
    },
    {
        path: 'tab-saved',
        loadChildren: './tab-saved/tab-saved.module#TabSavedPageModule'
    }
];
@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
