export function createOrUpdateObjectFromParams(obj: any, data: Object): any {
    const parameters : string[] = Object.keys(data);
        parameters.forEach((parameter) => {
            obj[parameter] = data[parameter];
        });
        return obj;
}