Expanding on the original requirement for the exercise. Instead of using animals, I went with the winners of best actor and actress awards for the Oscars. I found lists that provided me the names of winners up to 2017. There did not appear to be an API that would provide a constantly updating list but there is a max of two winners every year and if the user already won an Oscar, they would don’t need to be added. Updating the list would be limited. 

I have 2 arrays. peeps is a list of all winners. btnList is a list of all winners the user has selected. 

By making the list a specific finite list, I had to worry about the user being able to identify the winners of best actor or actress. To overcome this, I added a checkName function on the search button click. This will search through all the names in peeps and sees if the text in the input appears in any of the names. If more than one match exists, a dialog window shows the names that match the search criteria. The use can click on a name or close the modal to try a new name. Clicking on one of the matches send the name into the checkName function since there is only one match per name. Example, typing in Fonda will show Henry Fonda and Jane Fonda.

During testing I found an oversight where if the full name of the value sent into checkName is also a substring of other winners, I would still get multiple potential people in the second time the checkName is called. Example: If the user chose Cher from the modal, it would still pick up Cher and Louise Fletcher. To overcome this, I added an additional parameter to the checkName. I now check for a string of the name of the winner, a Boolean to determine if I need a contains vs an exact match check, and a callback function so the results can have access to the data of the object.

Once the user selects a winner from peeps. It splices that name out of peeps and adds it to btnList. In addition to adding the button, the code also fires the function to get the gifs related to the search.

Clicking on any buttons also fires off the gif search.

The fixed footer has the Hollywood sign while the hills do have a repetitive background. I contemplated making some oscillating search lights happening in the background but passed on that option.

