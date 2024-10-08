import { Router } from "express";
import Docker from "dockerode";

const router: Router = Router();
const docker = new Docker();

const PYTHON_ALGORAND_IMAGE = 'python-algorand';

interface LanguageConfig {
    image: string;
    executeCmd: (code: string) => string[];
}

const languageConfigs: Record<string, LanguageConfig> = {
    python: {
        image: PYTHON_ALGORAND_IMAGE,
        executeCmd: (code) => ['python', '-c', code],
    },
};

async function runCode(language: string, code: string): Promise<{ stdout: string; stderr: string }> {
    const config = languageConfigs[language];
    if (!config) {
        throw new Error(`Unsupported language: ${language}`);
    }

    const container = await docker.createContainer({
        Image: config.image,
        Cmd: config.executeCmd(code),
        AttachStdout: true,
        AttachStderr: true,
        Tty: false,
    });

    await container.start();

    const logs = await container.logs({ follow: true, stdout: true, stderr: true });

    let stdout = '';
    let stderr = '';
    logs.on('data', (chunk) => {
        let i = 0;
        while (i < chunk.length) {
            const header = chunk.readUInt8(i);
            const payloadSize = chunk.readUInt32BE(i + 4);
            const payload = chunk.slice(i + 8, i + 8 + payloadSize).toString('utf8');
            
            // 1 for stdout, 2 for stderr
            if (header === 1) {
                stdout += payload;
            } else if (header === 2) {
                stderr += payload;
            }
            
            i += 8 + payloadSize;
        }
    });

    await new Promise((resolve) => container.wait(resolve));
    await container.remove();

    return { stdout: stdout.trim(), stderr: stderr.trim() };
}

router.post("/execute-code", async (req, res) => {
    try {
        const { code } = req.body;

        const { stdout, stderr } = await runCode("python", code);
        return res.json({ stdout, stderr });
    } catch (error) {
        console.error('Error running code:', error);
        return res.status(500).json({ error: 'Failed to run code' });
    }
});

export default router;