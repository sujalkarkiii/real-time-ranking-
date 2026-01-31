import { Length, IsString, IsArray, ArrayNotEmpty, ArrayMaxSize } from 'class-validator';

export class createnominee {

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(25)
  @IsString({ each: true })
  name: string[]

  @IsString()
  pollId: string
}


export class savenominee {

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(25)
  @IsString({ each: true })
  name: string[]

  @IsString()
  pollId: string
}
