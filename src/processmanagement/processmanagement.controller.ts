import { Controller, Post, Body } from '@nestjs/common';
import { InputFileEto } from './etos/input-file.eto';
import { FileEto } from './etos/file.eto';
import { MergerEto } from './etos/merger.eto';

@Controller('processmanagement')
export class ProcessmanagementController {
  mergeTimeout = setTimeout(() => process.exit(0), 30000);

  @Post('/isValidInput')
  isValidInput(@Body() inputFile: InputFileEto) {
    const path: string = inputFile.path;
    if (path.includes('.nest')) {
      return true;
    }
    return false;
  }

  @Post('/tsplugin/merge')
  merge(@Body() merger: MergerEto) {
    clearTimeout(this.mergeTimeout);
    const patchContent: string = merger.patchContent.replace(/\\n/gm, '\n');
    const baseContent: string = merger.baseContent.replace(/\\n/gm, '\n');
    const patchOverrides: boolean = merger.patchOverrides;

    const tsm = require('@devonfw/ts-merger');
    const mergedCode: string = tsm.merge(
      baseContent,
      patchContent,
      patchOverrides,
    );

    this.mergeTimeout = setTimeout(() => process.exit(0), 30000);
    return mergedCode;
  }

  @Post('/tsplugin/beautify')
  beautify(@Body() file: FileEto) {
    const content: string = file.content.replace(/\\n/gm, '\n');

    const beautify = require('js-beautify');
    const beautifiedCode: string = beautify(content);

    return beautifiedCode;
  }
}
