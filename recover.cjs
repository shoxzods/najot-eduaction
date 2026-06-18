const fs = require('fs');
const readline = require('readline');

const logFile = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\fe9d3042-e072-4564-87a1-a6a89eafd37d\\.system_generated\\logs\\transcript.jsonl';

async function recover() {
    const fileStream = fs.createReadStream(logFile);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let msbarContent = null;
    let sbarContent1 = null;
    let sbarContent2 = null;
    let fullSbar = null;

    for await (const line of rl) {
        try {
            const parsed = JSON.parse(line);
            if (parsed.content && parsed.content.includes('File Path: `file:///c:/Users/user/Desktop/najot_eduaction-master/src/components/ManagementSidebar/ManagementSidebar.tsx`')) {
                msbarContent = parsed.content;
            }
            if (parsed.content && parsed.content.includes('File Path: `file:///c:/Users/user/Desktop/najot_eduaction-master/src/components/Sidebar/Sidebar.tsx`')) {
                if (parsed.content.includes('Showing lines 1 to 100')) {
                    sbarContent1 = parsed.content;
                }
                if (parsed.content.includes('Showing lines 70 to 110')) {
                    sbarContent2 = parsed.content;
                }
                if (parsed.content.includes('Showing lines 1 to 140') || !parsed.content.includes('Showing lines')) {
                    fullSbar = parsed.content;
                }
            }
        } catch (e) {}
    }

    fs.writeFileSync('recover_msbar.txt', msbarContent || 'Not found');
    fs.writeFileSync('recover_sbar1.txt', sbarContent1 || 'Not found');
    fs.writeFileSync('recover_sbar2.txt', sbarContent2 || 'Not found');
    fs.writeFileSync('recover_sbar_full.txt', fullSbar || 'Not found');
    console.log("Done extracting");
}
recover();
