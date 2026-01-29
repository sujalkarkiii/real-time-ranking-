import { Length,  IsString } from 'class-validator';

export class createnominee {


  @IsString()
  @Length(1, 25)
  name: string;

  @IsString()
  pollId:string
}

