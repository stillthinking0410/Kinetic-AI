import { IsNotEmpty,IsString, IsOptional,IsNumber } from 'class-validator';

export class CreateEventDto {
    @IsNotEmpty()
    @IsString()
    sensorId: string;

    @IsNotEmpty()
    @IsNumber()
    value: number;

    @IsOptional()
    @IsString()
    type?: string;
}