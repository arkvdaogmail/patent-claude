<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Direct Upload Test</title>
    <style>
        body { font-family: sans-serif; padding: 2rem; }
        #response { margin-top: 1rem; padding: 1rem; border: 1px solid #ccc; background: #f0f0f0; white-space: pre-wrap; }
    </style>
</head>
<body>
    <h1>Test VeChain Upload</h1>
    <p>This form submits directly to the <code>/api/upload</code> endpoint, bypassing Stripe.</p>
    
    <form id="uploadForm">
        <input type="file" name="document" required>
        <button type="submit">Upload and Notarize</button>
    </form>

    <h2>Response:</h2>
    <pre id="response">Awaiting submission...</pre>

    <script>
        const form = document.getElementById('uploadForm');
        const responseEl = document.getElementById('response');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            responseEl.textContent = 'Uploading...';

            const formData = new FormData(form);

            try {
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                const data = await res.json();
                responseEl.textContent = JSON.stringify(data, null, 2);

            } catch (error) {
                responseEl.textContent = `Error: ${error.message}\n\nCheck the Vercel function logs for details.`;
                console.error(error);
            }
        });
    </script>
</body>
</html>

