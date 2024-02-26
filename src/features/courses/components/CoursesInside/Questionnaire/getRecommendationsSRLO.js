

export function getRecommendationsSRLO(userResponses) {
    const recomendationList = []
    const sizeSequence = [4, 5, 3, 5, 5, 5, 3, 4, 5, 5];
    let posicionSecuencia = 0;

    sizeSequence.forEach((size, index) => {
        const grupo = userResponses.slice(posicionSecuencia, posicionSecuencia + size);
        posicionSecuencia += size;

        // Calcular la media del grupo actual
        const respuestasNumeros = grupo.map(response => transformToNumber(response.answer));
        const mediaGrupo = respuestasNumeros.reduce((a, b) => a + b, 0) / size;
        recomendationList.push(returnRecommendation(mediaGrupo, index) || null);
    })
    console.log(recomendationList)
    return recomendationList

}

function returnRecommendation(mediaGrupo, grupo) {
    switch (grupo) {
        case 0:
            if (mediaGrupo < 4) {
                return "Break tasks into achievable steps so that you can be successful in achieving those steps. Start small, and as you become more successful, make the steps bigger. Look around you at peers and see how they are doing. Can you learn from their approaches? Seek feedback, from yourself and others, as to what you are doing well. Make sure you celebrate your successes."
            }
            break;
        case 1:
            if (mediaGrupo < 4) {
                return "Online Intrinsic motivation does not come from grades but from your own interest. Reflect on the reasons you originally enrolled in the university. Think about your own personal reasons for learning the material. What do you want to achieve, what do you enjoy learning about, why is it important for you to do well and learn the material? Think about what stimulates your curiosity? Lastly, make sure you celebrate your successes. "
            }
            break;
        case 2:
            if (mediaGrupo < 4) {
                return "Intrinsic motivation is thought to be more helpful than extrinsic motivation. However, you can improve your extrinsic motivation through setting an external goal, such as grade or getting into a postgraduate course."
            }
            break;
        case 3:
            if (mediaGrupo < 4) {
                return "If you are feeling anxious or hopeless, take a deep breath and say 'I can do this', speak to family, friends or a health professional, practice relaxation exercises before studying, and focus on the task, not what others might be thinking, remember times you have performed well in the past. If you are feeling bored, mix up the topics you are studying, reward yourself with regular breaks, or try and make studying fun."
            }
            break;
        case 4:
            if (mediaGrupo < 4) {
                return "Planning and managing time can be long or short term. Think about what you want to achieve from a study session, what you want to achieve from an assignment, and your course. Consider breaking large goals into smaller actionable goals. Consider using a diary with a timetable for weekly planning. Plan out how you meet assignment deadlines across the semester. At the start of each study session, create and prioritise lists of tasks you want to achieve."
            }
            break;
        case 5:
            if (mediaGrupo < 4) {
                return "Before you start a study session, make a plan of the activities you want to do. Look over the readings/instructions, so you get an idea of how it is organised. While looking over the resources, check your understanding of the content or the requirements of the activity. Try to determine which concepts you don't understand well so you can spend more time on them. Ask yourself questions such as, is this task similar to previous tasks? Can I do things differently from last time? Perhaps go back over the old assignment and look at the feedback you have received. How does your performance now compare? Can you adjust your current work based on previous feedback? If available, check your work against the rubric. How does your work compare? Are you meeting the standards you want to achieve? "
            }
            break;
        case 6:
            if (mediaGrupo < 4) {
                return "Make sure you can find a quiet, distraction-free place to study. You may want to change the place where you study, or the times when you study, or who is around you when you study."
            }
            break;
        case 7:
            if (mediaGrupo < 4) {
                return "Keep a list of the topics that you find yourself procrastinating instead of studying. Try to analyse why you postpone studying these topics. Think about the strategies you could use to help you persist. For example, at the start of a study session, make a list of small achievable goals and concentrate on just achieving one at a time. Put distractions such as your phone in the other room. Set yourself a timer to study for a period of time (e.g. 30 minutes), before stopping for a break. Give yourself a reward if you reach a planned study goal."
            }
            break;
        case 8:
            if (mediaGrupo < 4) {
                return "Consider talking to your teacher, peers in your class, or learning advisors to see how they can help. Connecting with, or learning from, teachers and peers does not have to be synchronous; consider other ways to connect through email, discussion boards and social media. Use online search engines to help you understand the content better."
            }
            break;
        case 9:
            if (mediaGrupo < 4) {
                return "When reading or listening to lecture content, spend time thinking about how the material relates to information you already know. Can you create your own examples that are different from the ones given? Try and make summaries of what you have learnt in your own words. Think critically about what the information means and whether you agree with the author’s conclusions."
            }
            break;
        default:
            return "You may benefit from a more structured learning environment."
    }
}


function transformToNumber(response) {
    switch (response) {
        case "Strongly Disagree":
            return 1
        case "Disagree":
            return 2
        case "Somewhat Disagree":
            return 3
        case "Neutral":
            return 4
        case "Somewhat Agree":
            return 5
        case "Agree":
            return 6
        case "Strongly Agree":
            return 7
        default:
            return 4
    }
}