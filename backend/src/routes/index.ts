import { Router } from "express";
import Docker from "dockerode";

const router: Router = Router();
const docker = new Docker();

const PYTHON_ALGORAND_IMAGE = 'python-algorand';
const PYTHON_ALGORAND_CONTAINER = 'algokit_sandbox_python_algorand';

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

    const container = docker.getContainer(PYTHON_ALGORAND_CONTAINER);

    const exec = await container.exec({
        Cmd: config.executeCmd(code),
        AttachStdout: true,
        AttachStderr: true,
    });

    const stream = await exec.start({ hijack: true, stdin: false });

    let stdout = '';
    let stderr = '';

    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => {
            let i = 0;
            while (i < chunk.length) {
                const header = chunk.readUInt8(i);
                const payloadSize = chunk.readUInt32BE(i + 4);
                const payload = chunk.slice(i + 8, i + 8 + payloadSize).toString('utf8');
                
                if (header === 1) {
                    stdout += payload;
                } else if (header === 2) {
                    stderr += payload;
                }
                
                i += 8 + payloadSize;
            }
        });

        stream.on('end', async () => {
            try {
                const inspectResult = await exec.inspect();
                resolve({
                    stdout: stdout.trim(),
                    stderr: stderr.trim(),
                });
            } catch (error) {
                reject(error);
            }
        });

        stream.on('error', (error) => {
            reject(error);
        });
    });
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


router.get("/health", (req, res) => {
    return res.json({ message: "OK" });
});

export default router;
