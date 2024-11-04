/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from '@classes';

export interface IRoute {

    segment: string;

    provider: any | Router;

    serializable: boolean;
}