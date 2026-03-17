export const tools = [
  {
    type: 'function',
    function: {
      name: 'get_current_time',
      description: 'Get the current time in ISO format',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
];

export const toolHandlers: Record<string, Function> = {
  get_current_time: () => {
    return JSON.stringify({ time: new Date().toISOString() });
  },
};
