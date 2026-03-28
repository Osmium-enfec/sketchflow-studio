import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

let ffmpegInstance: FFmpeg | null = null;
let isLoaded = false;

/**
 * Lazily load and initialize FFmpeg.wasm (single-threaded, no SharedArrayBuffer needed).
 * First call downloads ~25MB WASM core; subsequent calls return the cached instance.
 */
export async function loadFFmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance && isLoaded) return ffmpegInstance;

  const ffmpeg = new FFmpeg();

  ffmpeg.on('log', ({ message }) => console.log('[ffmpeg-log]', message));

  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

  console.log('[loadFFmpeg] Fetching core JS...');
  const coreURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript');
  console.log('[loadFFmpeg] Fetching WASM...');
  const wasmURL = await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm');
  console.log('[loadFFmpeg] Both fetched, calling ffmpeg.load()...');

  await ffmpeg.load({ coreURL, wasmURL });
  console.log('[loadFFmpeg] Loaded successfully');

  ffmpegInstance = ffmpeg;
  isLoaded = true;
  return ffmpeg;
}
