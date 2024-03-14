# **Server-Side APIs Challenge: Weather Dashboard**

The purpose of this project was to create a weather dashboard that shows a 5-Day forecast.. 

We were to build a page that lets the user add important events to a daily planner, so that time can be managed effectively.

I began by doing research and finding sources -- these youtube videos were equally helpful in various partys of the assignment.

Sources: https://www.youtube.com/watch?v=m9OSBJaQTlM&ab_channel=PortEXE, https://momentjs.com/docs/#/displaying/

I followed the videos to create the Javascript, HTML, and CSS. Here are some screenshots of how my process worked. First, I grabbed colors I liked more and messed around with them for the past/present/future tabs. These were adjusted slightly as I went along to make something that was more clearly a past/future color, but still kept the colors pastel-themed.

![color palette](./Develop/images/palette.png)

Next, I updated it to go include half-hour marks too, just to make for the most efficient schedule in case there were ever meetings scheduled on the half-hour mark. This move helps with accuracy during the work day. I also added a fature that added a clock to the page, and an element that shows the day of the week and date.

![top page](./Develop/images/top.png)

Then, I updated the colors and got them to show past/present/future and update automatically as the day went on.

![colors updating](./Develop/images/colors.png)

I also added a cool feature where it automatically saves what you type out on the schedule, so you don't need to click the save button (though it still works, per the assignment requirements); this helps with efficiency and saving your progress as you go, in case the user accidentally closes out of the program before saving.

![schedule-edits](./Develop/images/schedule_edits.png)

Here is a cool feature of the colors changing times as the day goes on -- see how the 4:30PM time block is now light purple, and the 5:00PM time block is the darker purple, signaling for the future times.

![colors changing](./Develop/images/colors%20changing%20times.png)

In conclusion, I set up the quiz to meet the challenge requirements and improved it. I:
- opened the planner, the current date and time is displayed at the top of the page
- you can scroll down, and see time blocks for that day during the business hours of 9-5
- the time blocks are color-coded for past, present, and future events
- when you click on a time block, you can add text that saves straight to the page (as well as the save button)
- the cool feature I added is editable text and being able to keep it on the page without having to press save
- text is then saved in local storage, where when you refresh the page, it shows up
- you can also edit it and remove text as well

The hardest part was figuring out just how to get started and working with the local storage to get the text to keep showing up. I also had a lot of trouble getting the color timeblocks to change, but I figured it out by breaking messing with the ColorRow function.

Please follow this link to the successful, full deployed site on GitHub: https://szolton.github.io/05-challenge-week5/