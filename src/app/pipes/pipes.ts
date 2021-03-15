import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetScorePipe } from './get-score.pipe';
import { GetUserPipe } from './get-user.pipe';

@NgModule({
    declarations: [GetScorePipe, GetUserPipe],
    imports: [CommonModule],
    exports: [GetScorePipe, GetUserPipe]
})
export class PipesModule {}
