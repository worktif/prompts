---
inclusion: auto
---

# Root Cause Problem Solving — Mandatory Protocol

## The Core Rule

**NEVER write code to fix a symptom. ALWAYS find and fix the root cause first.**

If you cannot state the root cause in one sentence, you do not understand the problem. Say so explicitly. Do not guess. Do not "try something". Do not add validations, wrappers, checks, or fallbacks that paper over the real issue.

## Before ANY Code Change

### Step 1: State the Root Cause (MANDATORY)

Write one sentence:
> "The root cause is: ___"

If you cannot fill this in with certainty — STOP. Say:
> "I don't understand the root cause yet. Here's what I need to clarify: ___"

Do NOT proceed to code. Do NOT write "let me check" and then start editing files. Investigate first, understand fully, then act.

### Step 2: State the Fix (MANDATORY)

Write one sentence:
> "The fix is: ___"

This must directly address the root cause from Step 1. If the fix doesn't eliminate the root cause, it's a patch, not a fix. Start over.

### Step 3: Verify Scope (MANDATORY)

Ask yourself:
- Does this fix change the minimum number of files?
- Does this fix align with the existing architecture, or does it fight it?
- Am I adding new abstractions, files, or patterns? If yes — WHY? Is the existing system insufficient?
- Would the project owner look at this diff and say "yes, obviously"?

If the answer to any of these is uncertain — STOP and re-examine.

## Anti-Patterns — NEVER Do These

### 1. Symptom Patching
Adding `fs.existsSync()` checks, try/catch wrappers, fallback values, or validation layers to suppress an error instead of fixing why the error occurs.

**Test:** If you remove your change, does the underlying architectural problem still exist? Then you patched a symptom.

### 2. Assumption Cascading
Making one wrong assumption, then building more code on top of it. Each layer of code feels productive but moves further from the solution.

**Test:** Can you trace every line of your change back to a confirmed fact (not an assumption)? If any line traces back to "I think this is how it works" — stop and verify.

### 3. Premature Code Writing
Starting to write code before fully understanding the system. Reading one file and immediately editing, instead of reading all relevant files first and building a complete mental model.

**Test:** Before writing code, can you draw the data flow on paper? If not, you don't understand the system yet.

### 4. Solving the Wrong Problem
The user says X. You interpret it as Y. You solve Y thoroughly. The user is frustrated because X is still broken.

**Test:** Re-read the user's exact words. What did they literally say? Not what you inferred — what they said. If there's any ambiguity, state your interpretation explicitly before coding.

### 5. Adding Complexity Instead of Removing It
Creating new functions, new files, new abstractions, new build steps — when the real fix is removing or simplifying existing code.

**Test:** Is your diff a net addition of code? If yes, ask: could the fix be a net deletion instead?

### 6. Ignoring Existing Patterns
The codebase already has a working pattern for the same problem (e.g., RuntimeStack already does X correctly). Instead of following that pattern, you invent a new approach.

**Test:** Is there an existing, working implementation of the same concept elsewhere in the codebase? Use it. Don't reinvent.

## When You're Stuck

If you've been going back and forth on the same issue:

1. STOP writing code
2. List what you know as FACTS (confirmed by reading code)
3. List what you ASSUME (not confirmed)
4. For each assumption — verify it or discard it
5. Re-state the root cause with only facts
6. Only then propose a fix

## When the User Corrects You

If the user says your approach is wrong:

1. Do NOT defend your approach
2. Do NOT immediately try a "variation" of the same wrong approach
3. STOP and re-read everything the user has said in this conversation
4. Identify what you misunderstood
5. State the misunderstanding explicitly
6. Ask yourself: what is the simplest interpretation of what the user wants?
7. That simple interpretation is almost certainly correct

## Conversation Discipline

- If you said you'd do something and the result was wrong — don't repeat the same action with minor tweaks. That's the definition of the problem this document exists to prevent.
- If you're about to write more than 20 lines of code — pause and verify you're solving the right problem.
- If your fix requires touching more than 3 files — pause and verify the architecture. Simple problems have simple fixes.
- If you're adding a new function/method/class — ask: does this NEED to exist, or am I compensating for a misunderstanding?

## The Ultimate Test

Before submitting any change, ask:

> "If I showed this diff to the project architect with zero context, would they immediately understand WHY this change exists and agree it's the right approach?"

If the answer is no — you're solving the wrong problem or solving it the wrong way.
