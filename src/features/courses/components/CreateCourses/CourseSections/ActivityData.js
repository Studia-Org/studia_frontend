export const PeerReviewData = {
    id: Math.random().toString(16).slice(2),
    title: 'Peer Review',
    description: 'Evaluate your peers',
    deadline: null,
    ponderation: null,
    categories: null,
    type: 'peerReview',
    files: null,
    PeerReviewRubrica: {},
    order: null,
    evaluable: false,
}

export const ForumData = {
    id: Math.random().toString(16).slice(2),
    title: 'Forum',
    description: 'Interact in the forum',
    deadline: null,
    ponderation: null,
    categories: null,
    type: 'forum',
    files: null,
    order: null,
    evaluable: false,
}

export const ThinkAloudData = {
    id: Math.random().toString(16).slice(2),
    title: 'Forum',
    description: `
## Think Aloud Activity Description

Welcome to the Think Aloud activity! In this task, you will have the opportunity to record your thoughts and verbalize your problem-solving process while completing a given task or assignment. This activity is designed to enhance your understanding of the material and develop effective problem-solving strategies.

### Instructions:

1. **Select a Task:** Choose a problem or assignment from your e-learning platform that you would like to work on for this activity. It could be a math problem, a reading passage, a coding challenge, or any task that requires problem-solving skills.

2. **Prepare to Record:** Ensure that you have a recording device ready to capture your voice. This could be a smartphone, computer, or any other device with a microphone. Make sure the recording quality is clear and audible.

3. **Start Recording:** Begin working on the selected task while verbally expressing your thoughts. Speak clearly and coherently, articulating every step of your problem-solving process. Explain your understanding of the task, the strategies you plan to use, and the reasoning behind each step.

4. **Address Difficulties:** If you encounter difficulties or make mistakes during the task, continue to verbalize your thoughts. Explain how you plan to address the challenges and any adjustments you make to your approach.

5. **Review and Edit (Optional):** After completing the task, stop the recording and review it if necessary. You may choose to edit certain sections for clarity or provide additional explanations.

6. **Upload Your Recording:** Once you are satisfied with the recording, upload it to the designated platform for this activity. This could be a file upload feature or an integrated recording tool within the e-learning platform.

7. **Reflect:** Take a moment to reflect on your problem-solving process and the experience of conducting a Think Aloud. Consider how verbalizing your thoughts helped improve your understanding of the task and identify areas for further improvement.

### Tips:

- Speak clearly and at a moderate pace to ensure your thoughts are easily understandable.
- Provide thorough explanations for each step of your problem-solving process.
- Don't hesitate to pause or take breaks if needed during the recording.
- Use the opportunity to learn from your own thought process and explore alternative problem-solving strategies.

Happy recording and problem-solving!
`,
    deadline: null,
    ponderation: null,
    categories: null,
    type: 'thinkAloud',
    files: null,
    order: null,
    evaluable: false,
};
