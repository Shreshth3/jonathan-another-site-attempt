# Distractor review rubric

Every wrong answer must pass all of these checks:

1. It is the exact result of a specific, believable student bug.
2. It has the same answer type and similar detail as the correct answer.
3. The prompt does not give away the answer before asking the question.
4. It is not silly, impossible, random, or unrelated.
5. Its feedback names the mistaken step and explains how to repair it.
6. Choices do not repeat the same Boolean or output with different explanations.
7. The correct answer is not consistently longer, more careful, or better written.

## Blind review

Reviewers must inspect shuffled choices without being told which answer is correct.
For every choice, they record:

- the likely correct answer;
- the exact student mistake behind every other answer;
- any clue from tone, length, precision, or formatting;
- a replacement for any answer that fails.

A question passes only when a reviewer can explain a plausible bug behind every wrong answer and cannot identify the correct answer from writing style alone.
