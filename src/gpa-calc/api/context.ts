let oldContext: any = null;

if(window.location.href.startsWith("https://catholiccentral.myschoolapp.com/app/student")){ 
    fetchContext().catch(e => {
        if(confirm(`"Failed to load context" issue:\n\nIt seems like MyCC is having issues. This is an experimental fix provided by CC GPA Calc.\nPress OK to be redirected, fill out the captcha, and then return to the page to try to fix the issue`)){
            window.location.href = "/api/webapp/context";
        }
    })
}

export async function fetchContext(): Promise<any> {
    if (oldContext && new Date(oldContext.Expire).getTime() > Date.now()) {
        return oldContext
    }

    const context = await fetch(
        `https://catholiccentral.myschoolapp.com/api/webapp/context`
    ).then((res) => res.json());

    oldContext = context;

    return context;
}



export async function getUserId() {
    return (await fetchContext()).UserInfo.UserId;
}