import { curry, move } from "ramda";

const FILTER_TOKENS = {
  '\r': true,
  '\n': true,
  ' ': true /* DEVLOPMENT */
};

function lexical(stream: string): string[] {
  const LENGTH: number = stream.length;
  const tokens: string[] = [];
  if (LENGTH <= 0) return;

  let pos: number = 0;
  while (LENGTH > pos) {
    
    if (FILTER_TOKENS[stream[pos]]) {
      pos++;
      continue;
    }

    let newPos = handle(stream, pos);

    if (pos < newPos) {
      tokens.push(
        stream.slice(pos, newPos)
      );
    } else {
      pos++;
    }

    pos = newPos;
  }

  return tokens;
}

function handle(stream: string, pos: number): number {
  let c: string = stream[pos];
  const LENGTH: number = stream.length;
  let move = curry(loopMove)(pos, stream, pos => LENGTH > pos);
  switch (c) {
    case '<':
      return handleTag(move);
    case '\r':
    case '\n':
      return ++pos;
    case '\\':
      if (stream[pos + 1] === '\\') {
        return handleComment(move);
      } else {
        return handleText(move);
      }
    default:
      return handleText(move);
  }
}

function handleTag(
  move: (
    DbreakCondi: (c: string, pos: number) => boolean
  ) => number
): number {
  return move(c => c === '>') + 1;
}

function handleComment(
  move: (
    DbreakCondi: (c: string, pos: number) => boolean
  ) => number
): number {
  return move(c => c === '\r');
}

function handleText(
  move: (
    DbreakCondi: (c: string, pos: number) => boolean
  ) => number
) {
  return move(c => c === '<');
}

function loopMove(
  pos: number,
  stream: string,
  boundCondi: (pos: number) => boolean,
  breakCondi: (c: string, pos: number) => boolean
): number {
  while (boundCondi(++pos)) {
    if (breakCondi(stream[pos], pos)) {
      return pos;
    }
  }
  return pos;
}

export default lexical;