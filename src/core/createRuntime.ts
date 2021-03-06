import HexFormatter from "../abstractions/formatter.ts";
import HexFunction from "../abstractions/function.ts";
import HexFunctionInput from "../abstractions/functionInput.ts";
import HexFunctionResult from "../abstractions/functionResult.ts";
import HexPlatform from "../abstractions/platform.ts";
import HexRuntime from "../abstractions/runtime.ts";
import textPlainFormatter from "../formatters/text-plain.ts";

function pickProperFormatter(): HexFormatter {
  // TODO for now there's only text/plain formatter
  return textPlainFormatter;
}

function createRuntime(
  platform: HexPlatform,
  options?: Record<string, unknown>,
): HexRuntime {
  function execute(
    target: HexFunction,
    input?: HexFunctionInput,
  ): Promise<void> {
    const result: HexFunctionResult = target(
      input ?? platform.getDefaultInput(),
      platform.getContext(),
    );

    const formatter: HexFormatter = pickProperFormatter();
    const formattedResult: Promise<string> = formatter(result);

    return platform.commitResult(formattedResult);
  }

  return {
    platform: platform,
    options: options,
    execute: execute,
  };
}

export {
  createRuntime as default,
};
