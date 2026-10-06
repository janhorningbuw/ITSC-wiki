This page serves as an information hub for our seminars. It contains information about advising students and organisation of the seminar.
At the bottom of the page you can also find a template for the course's Moodle page.

# Exam Procedure
* Students will be asked to send a mail with a list of topics they would like to do (in order of preference). The seminar organizer will then distribute topics and let the students know their assigned topics.
    - Also ask the students for the information necessary to submit their grade to the exam office, specifically matrikelnummer, full name, and study course. For the master they should also provide the module, by default this is Seminar Computer Engineering.
* The student MUST write a thesis and MUST hold a presentation about their results. The presentation should last 20 minutes, then there are 5 minutes for questions. If there are a lot of students, then we might also decrease the time per presentation to make sure they fit into one day. Ideally this is decided after we know how many submissions there are. Students MUST listen to each other's talks (as also stated in the Prüfungsordnung), therefore we usually organise all the talks to be in a single day. 
* The student MUST write a form of proposal document which gives a short overview of their topic and how they plan their thesis to look. This will be submitted in the middle of the semester before the full thesis. If this document does not satisfy our standards, then we can fail the student. If it does pass, then we will from this point on consider the student to be registered for the seminar. If the student then fails to submit a thesis / does not attend the presentations, we will submit a 5.0 grade to the examination office.
* The thesis MUST be written in LaTeX to ensure nice formatting and to prepare the student for their bachelor thesis. The student can use our template at https://git.uni-wuppertal.de/itsc-researchers/templates/-/tree/master/seminar-template , this is not required, however. The link is private, so feel free to distribute the template files.
* The presentation does not have to be in LaTeX, the students can use whatever tool they like here.
* The presentation slides MUST be in english to allow our non-german-speaking group members to follow along. The presentation itself may be in german.

# Tips for Advisors

* If you want regular updates from your student regarding their process, you could suggest to them to use a shared Git repo to host their thesis. You can then check in occasionally to look at their thesis.
* It is probably a good idea to hold an initial meeting to discuss the student's existing knowledge, to explain the topic, and discuss expectations.

# Information for Organising the Seminar

This is in chronological order.

## Collecting Topics
A few weeks before the start of the semester, the seminar organiser asks all the potential advisors to provide Master- and Bachelor-level seminar topics, currently 2 Bachelor and 1 Master topics per person. The topic should include a short description that informs the student about the intended task.

## Deciding on Dates and Deadlines
* **Presentation Date and Thesis Submission:** To select a presentation date you will want to create a poll that the other advisors, as well as either Kai or Tibor, should fill out.
Everyone should be available on the same day, as the students should all be there to listen to each other's presentations.
The current approach here is to pick the presentation date to be *during* the lecture-period, to avoid conflicts with advisor's vacations. 
The thesis should also be submitted at least roughly a week before the presentations.
This allows us to also ask questions related to the written thesis during the oral exam.
Note that the student's do not get any say on the presentation date.
The presentation date should be fixed before the seminar registration opens, and then only students should register that can make this date.
This is to simplify the process of picking a date as the probability that all students can make the same day is slim.

* **Registration Deadline:** Lastly you must decide on a registration date, usually we pick a day in the second week of the semester. 
This is to ensure that the students have sufficient time to pick the topics they like.

## The Course Moodle Page
We have a Moodle page for the seminar, this is created newly once per semester.
The Moodle page contains information that is relevant to the students such as information on deadlines, formal requirements, and offered topics.

On the bottom of this page you can find a template for the Moodle page.

## Distributing Topics
Once the registration deadline has passed, topics have to be distributed. We usually ask the student's to submit three to five topic choices in order of preference.
Often, there will be certain topics that are very popular and everyone wants to have, resulting in conflicts.
So then you will have to pick which student to give the topic to. 
You can do this as you like, for example by chance or by picking the student you believe to be most suitable.

Students may also try to manipulate the distribution process, for example by only submitting two choices, hoping that you would then be more likely to give them one of these.
If this happens, and there are other students who want the same topic, feel free to discourage such behavior by not giving the offender any of the desired topics.

## Initial Lecture
This may be the first time that many students write a scientific text.
It may therefore make sense to hold an initial lecture towards the beginning of the semester, discussing topics such as
* Writing style
* Citing correctly
* Plagiarism and AI usage

Centralising this information inside a lecture will mean that the advisors do not have to explain this again later, hopefully improving the resulting theses and saving time.
In the past there was however the issue of attendance.
If the lecture is non-mandatory, then only the engaged and good students attend, and not the students which may need it the most.

## Thesis Storage
Once the students have submitted their thesis, they should be stored in our sciebo for documentation purposes.
We usually use the folder `ITSC-Teaching/<YEAR>/Seminar/Theses` for this (replace `<YEAR>` with the current year).

# Moodle Page Template (use Moodle HTML editor)
**TODO:** Update this template based on the SoSe 26 page.
```
<style>
    details {margin: 10px;}
    dl { display: grid; grid-template-columns: max-content auto; }
    dt { font-weight: bold; }
</style>
<div><h1>IT Security and Cryptography Seminar for ENTER SEMESTER HERE</h1></div>
<p>This is the page for the Bachelor and Master's seminars of the <a href="https://itsc.uni-wuppertal.de/de/">ITSC chair</a> for ENTER SEMESTER HERE.
<hr>
<div><h2>Important Dates and Deadlines</h2>
<dl>
    <dt>Registration Deadline:</dt>
    <dd>ENTER REGISTRATION DEADLINE HERE.</dd>
    
    <dt>Thesis Submission Deadline:</dt>
    <dd>ENTER SUBMISSION DEADLINE HERE.</dd>

    <dt>Presentation Date:</dt>
    <dd>ENTER PRESENTATION DATE HERE.</dd>
</dl>
</div>

<div><h2>Essential Information</h2>
<dl>
    <dt>Course level:</dt> 
    <dd>Bachelor (module "Seminar zur Informatik" and "Seminar zur Informatik 2") and Master (module "Seminar Computer Engineering", other "Vertiefungsbereich" can be considered on request).</dd>
    <dt>Language:</dt>
    <dd>German and/or english depending on the advisor's abilities. For the presentation <b>the slides MUST be in english</b>, to allow the non-german-speaking people to at least roughly follow along.</dd>
    <dt>Contact email:</dt> 
    <dd>ENTER MAIL AND LANGUAGES OF CONTACT HERE.</dd>
    <dt>Registration method:</dt> 
    <dd>Send a mail by ENTER REGISTRATION DEADLINE HERE to ENTER CONTACT MAIL HERE including a sorted (by preference) list of <b>at least</b> 3 topics you would like to do, your study course (e.g. Bachelor Informatik), your Matrikelnummer, plus information on your relevant course experience. We will then distribute topics and let you know in the following week.</dd>
    <dt>Exam method:</dt> 
    <dd>Each student will initially be assigned one topic. To receive a grade you must then complete the following tasks:
        <ul>
            <li>Write a short (2 pages) document giving a high-level overview of your topic to be submitted by ENTER PROPOSAL DEADLINE HERE.
            This document will also formally register you for the seminar, dropping out afterwards will lead to failing the seminar with a 5.0.
            We only grade this based on completeness, so the quality will not affect your grade. However, completeness means that we expect you to include all the information that we ask for. If you do not satisfy those base-line requirements, then you will fail the seminar at this point.</li>
            <li>Write a full thesis (10-15 pages) about your topic. The <b>thesis MUST be written in LaTeX</b> (we can provide you with a template).</li>
            <li>Hold an oral presentation about your topic, roughly 15-20 minutes. You can create the presentation using any program you want. This will be done on a fixed date specified by us.</li>
        </ul>
    </dd>
    <dt>Seminar thesis submission method:</dt> 
    <dd>Submission of the PDF and other files via e-mail to CENTER CONTACT MAIL HERE <b>and</b> your advisor until ENTER SUBMISSION DEADLINE HERE.</dd>
    <dt>Presentations:</dt>
    <dd>All presentations will be done on ENTER PRESENTATION DATE HERE. All students must also attend each other's presentations. <b>Please only apply if you can make this date, we will only make exceptions if you are sick and can provide a doctor's note to prove it. Otherwise you will automatically fail the seminar.</b></dd>
    <dt>AI guidelines:</dt> <dd>Please note our <a href="https://itsc.uni-wuppertal.de/en/theses/the-use-of-ai/">guidelines on usage of AI</a>. As part of your thesis you <b>must</b> indicate that you have adhered to these guidelines.</dd>
</dl>
<p>Note that except for the presentation date, there are no regular lectures or anything else that requires attendance.</p>
<p>Every topic will be assigned to a single student only (except where indicated that there are multiple slots), so we don't guarantee that every applicand will be offered a topic.</p></div>

<div><h2>Goals of the Seminar</h2>
<p>
The goals of the seminar are to teach you to (mostly) independently learn about a research topic, and present it to other students in the form of an oral presentation, and a written thesis.
This will teach you how to work scientifically, and with that prepare you for your future Bachelor's and/or Master's thesis.</p>

<p>
To facilitate this, we provide you with a topic and accompanying reading material.
Each topic has an accompanying advisor who will be able to help you along the way by giving feedback and answering questions.
However, they can only do this if you actually ask questions and submit work for your advisor to review (and give enough time for said review).
So start early and don't wait until too close to the deadline!
</p></div>

<div><h2>Helpful Material</h2>
<p>
<ul>
<li>Our chair provides a LaTeX template for the seminar thesis which you can obtain from your advisor. We recommend using it. </li>
<li>You must adhere to our guidelines on AI usage which you can find <a href="https://itsc.uni-wuppertal.de/en/theses/the-use-of-ai/">here</a>.</li>
<li><a href="https://cs.uni-paderborn.de/fileadmin-eim/informatik/fg/cuk/Lehre/Material/howto-seminar.pdf">This document</a> from Paderborn University has a lot of great tips on how to write your seminar thesis. Note that some of the links in there are specific to Paderborn, e.g. the link to their Git server, so keep that in mind.</li>
</ul>
</p></div>
<hr>
<!--You can use the div container to hide the topic list (e.g. using CSS display: none) until they are to be published-->
<div><h2>Offered Topics</h2>
<p>The topics have been split into Bachelor and Master seminar topics.
The offered languages (spoken by the advisor) are specified in parentheses behind the topic name.
To see a detailed description of the topic, click on the topic name.</p>

<h3>Bachelor Topics</h3>

<!--The details tag creates a spoiler tag such that the topic description can be hidden unless clicked upon.-->
<details>
    <summary>ENTER TITLE HERE (ENTER LANGUAGES OF ADVISOR HERE)</summary>
    ENTER DESCRIPTION OF TOPIC HERE
</details>

<details>
    <summary>ENTER TITLE HERE (ENTER LANGUAGES OF ADVISOR HERE)</summary>
    ENTER DESCRIPTION OF TOPIC HERE
</details>

<h3>Master Topics</h3>

<details>
    <summary>ENTER TITLE HERE (ENTER LANGUAGES OF ADVISOR HERE)</summary>
    ENTER DESCRIPTION OF TOPIC HERE
</details>

<details>
    <summary>ENTER TITLE HERE (ENTER LANGUAGES OF ADVISOR HERE)</summary>
    ENTER DESCRIPTION OF TOPIC HERE
</details>
</div>
```