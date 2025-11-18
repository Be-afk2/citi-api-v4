import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { InteractionEnum } from '../interfaces/interaction.enum';

@Injectable()
export class ParseInteractionPipe implements PipeTransform {
  /**
   * Parsea el valor de interacción a su enum correspondiente.
   * @param value deberia de ser el param del url
   * @returns Enum InteractionEnum correspondiente
   */
  transform(value: any) {
    const result = InteractionEnum[value];

    if (!result) {
      throw new NotFoundException(
        `Interaction not supported, you should use one of the following: [ ${Object.keys(InteractionEnum)} ]`,
      );
    }
    return result;
  }
}
