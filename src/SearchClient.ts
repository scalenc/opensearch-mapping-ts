/* eslint-disable @typescript-eslint/no-explicit-any */
import { Readable as ReadableStream } from 'stream';

export interface RequestEvent<TResponse = Record<string, any>, TContext = Context> {
  body: TResponse;
  statusCode: number | null;
  headers: Record<string, any> | null;
  warnings: string[] | null;
  meta: {
    context: TContext;
    name: string | symbol;
    request: {
      params: TransportRequestParams;
      options: TransportRequestOptions;
      id: any;
    };
    connection: unknown;
    attempts: number;
    aborted: boolean;
    sniff?: {
      hosts: any[];
      reason: string;
    };
  };
}

export type ApiResponse<TResponse = Record<string, any>, TContext = Context> = RequestEvent<TResponse, TContext>;
export type RequestNDBody<T = Record<string, any>[]> = T | string | string[] | Buffer | ReadableStream;
export type Context = unknown;

export interface TransportRequestParams {
  method: string;
  path: string;
  body?: RequestBody;
  bulkBody?: RequestNDBody;
  querystring?: Record<string, any> | string;
}

export interface TransportRequestOptions {
  ignore?: number[];
  requestTimeout?: number | string;
  maxRetries?: number;
  asStream?: boolean;
  headers?: Record<string, any>;
  querystring?: Record<string, any>;
  compression?: 'gzip';
  id?: any;
  context?: Context;
  warnings?: string[];
  opaqueId?: string;
}

export interface TransportRequestPromise<T> extends Promise<T> {
  abort: () => void;
  finally(onFinally?: (() => void) | undefined | null): Promise<T>;
}

export interface Generic {
  method?: string;
  filter_path?: string | string[];
  pretty?: boolean;
  human?: boolean;
  error_trace?: boolean;
  source?: string;
}

export interface IndicesCreate<T = RequestBody> extends Generic {
  index: string;
  include_type_name?: boolean;
  wait_for_active_shards?: string;
  timeout?: string;
  master_timeout?: string;
  body?: T;
}

export interface IndicesExists extends Generic {
  index: string | string[];
  local?: boolean;
  ignore_unavailable?: boolean;
  allow_no_indices?: boolean;
  expand_wildcards?: 'open' | 'closed' | 'hidden' | 'none' | 'all';
  flat_settings?: boolean;
  include_defaults?: boolean;
}

export interface IndicesPutMapping<T = RequestBody> extends Generic {
  index?: string | string[];
  type?: string;
  include_type_name?: boolean;
  timeout?: string;
  master_timeout?: string;
  ignore_unavailable?: boolean;
  allow_no_indices?: boolean;
  expand_wildcards?: 'open' | 'closed' | 'hidden' | 'none' | 'all';
  write_index_only?: boolean;
  body: T;
}

export type RequestBody<T = Record<string, any>> = T | string | Buffer | ReadableStream;

export interface TransportRequestPromise<T> extends Promise<T> {
  abort: () => void;
  finally(onFinally?: (() => void) | undefined | null): Promise<T>;
}

export interface SearchClient {
  indices: {
    create<TResponse = Record<string, any>, TRequestBody extends RequestBody = Record<string, any>, TContext = Context>(
      params?: IndicesCreate<TRequestBody>,
      options?: TransportRequestOptions
    ): TransportRequestPromise<ApiResponse<TResponse, TContext>>;
    exists<TResponse = boolean, TContext = Context>(
      params?: IndicesExists,
      options?: TransportRequestOptions
    ): TransportRequestPromise<ApiResponse<TResponse, TContext>>;
    putMapping<TResponse = Record<string, any>, TRequestBody extends RequestBody = Record<string, any>, TContext = Context>(
      params?: IndicesPutMapping<TRequestBody>,
      options?: TransportRequestOptions
    ): TransportRequestPromise<ApiResponse<TResponse, TContext>>;
  };
}
