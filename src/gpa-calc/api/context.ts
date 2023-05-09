let oldContext: any = null;

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