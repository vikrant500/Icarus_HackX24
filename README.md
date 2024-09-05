## Icarus

Icarus primarily does 2 things:
1.) increases attention span and focus by formatting web text in such a way that only necessary and useful information at hand is showcased using saccades interval and pomodoro interval techniques and by giving the student to edit 'bolded width', 'Saccades interval', 'unbolded opacity', 'colour of the bolded text' and finally the 'line height'.

2.) User can highlight a certain text and have gemini api summarize it for them and showcased in the same division of the HTML page for an even better user experience

3.) Maintains a score which tracks the overall quality of the neurodiverse students. For every 10 min a student spends on a website such as youtube, instagram, reddit, tiktok or any other media website that negatively affects the overall attention span of the student, 25 points are deducted from the original score till it reaches 0. Once the score is zero, the student is alerted to take a break from modern media and rest. For every 10 min the student spends on any other website such as wikipedia, udemy, etc., the student is rewarded 100 points showing is improvement in overall attention span and focus. The score is reset everyday and hence essentially keeps a track of score of each day.



the overall score is then tracked in a .csv file which is then fed to our Machine Learning model which as output shows whether a neurodiverse student has improved his attention span and focus or has deteriorated the same over the course of the past week based on the overall score of a week. We used a KSVM model due to lack of big data since project icarus is still in its initial stages. An overall accuracy of 96% was achieved from a buffer data of 100 entries (one entry per day)

The overall output is then sent to the faculty/parent incharge through a mail using webhooks.

The technology is made for neurodiverse students but can also be used by people of all age groups who may have trouble focussing at a task at hand due to modern media affects.

Current issues:
1.) the webhooks need to be optimized and must have a standard database to store data in cloud
2.) the gemini api does read the data correctly but is unable to implement the updated one in the body of HTML code.
3.) the pinning a page and instant full screen features are being difficult to implement due to the nature of various browser settings of different browsers.

future plans: 
1.) making a dashboard so that the faculty incharge and the parents are able to track their student's/child's responses and web behaviour.
2.) keeping a live track of various students so that essential comparisons can be made
3.) improvising the machine learning model from KSVM to random forest classification when a bigdata is gathered in our databases
