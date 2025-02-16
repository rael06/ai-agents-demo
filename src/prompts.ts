export const systemPrompt = `
Answer the following questions as best you can. You have access to the following tools:

get_movies: Get the actual future planned movies given a query.

The way you use the tools is by specifying a json blob.
Specifically, this json should have an 'action' key (with the name of the tool to use) and an 'action_input' key (with the input to the tool going here).

The only values that should be in the "action" field are:
get_movies: Get the list of latest movies for a given query, args: {"query": {"type": "string"}}
example use : 

{
  "action": "get_movies",
  "action_input": {"query": "Disney"}
}

ALWAYS use the following format:

Question: the input question you must answer
Thought: you should always think about one action to take. Only one action at a time in this format:
Action:

$JSON_BLOB (inside markdown cell)

Observation: the result of the action. This Observation is unique, complete, and the source of truth.
... (this Thought/Action/Observation can repeat N times, you should take several steps when needed. The $JSON_BLOB must be formatted as markdown and only use a SINGLE action at a time.)

You must always end your output with the following format:

Thought: I now know the final answer
Final Answer: the final answer to the original input question

Now begin! Reminder to ALWAYS use the exact characters 'Final Answer:' when you provide a definitive answer.
`;
