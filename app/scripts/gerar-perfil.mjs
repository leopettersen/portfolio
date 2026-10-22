import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('..', import.meta.url));
const output = fileURLToPath(new URL('../api/_perfil.ts', import.meta.url));

function contactValue({ link, text }) {
    if (link.startsWith('mailto:')) return link.slice('mailto:'.length);
    if (link.includes('wa.me')) return text;
    return link.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

function escapeTemplate(text) {
    return text.replaceAll('\\', '\\\\').replaceAll('`', '\\`').replaceAll('${', '\\${');
}

function buildProfile(pt, contacts) {
    const { about, workModels, experiences, projects } = pt;

    return [
        '# Quem sou',
        `- ${about.overviewTitle}. ${about.overviewParagraph}`,
        '',
        '# Formação',
        `- ${about.education.title} na ${about.education.college} (${about.education.period}).`,
        `- ${about.education.description}`,
        '',
        '# Experiência',
        ...experiences.map((experience) =>
            `- ${experience.organization} (${experience.period}), ${experience.experiencePosition}, ${workModels[experience.workModel].toLowerCase()}: ${experience.description} Habilidades: ${experience.skills.join(', ')}.`),
        '',
        '# Projetos',
        ...projects.map((project) => {
            const links = [`Repositório: ${contactValue({ link: project.repoLink })}`];
            if (project.liveLink) links.push(`Site: ${contactValue({ link: project.liveLink })}`);
            return `- ${project.name} (${project.date}): ${project.description} Tecnologias: ${project.technologies.join(', ')}. ${links.join('. ')}`;
        }),
        '',
        '# Interesses',
        `- ${about.interestsDescription}`,
        `- Temas: ${about.interestsTags.join(', ')}.`,
        '',
        '# Metas',
        ...about.goals.map((goal) => `- ${goal.title}: ${goal.description}`),
        '',
        '# Contato',
        ...contacts.map((contact) => `- ${contact.name}: ${contactValue(contact)}`),
    ].join('\n');
}

const server = await createServer({
    root,
    configFile: false,
    logLevel: 'silent',
    appType: 'custom',
    server: { middlewareMode: true, hmr: false },
});

try {
    const { pt } = await server.ssrLoadModule('/src/i18n/locales/pt.ts');
    const { contacts } = await server.ssrLoadModule('/src/data/contacts.ts');

    const source = [
        "import { EXTRA } from './_perfilExtra.js';",
        '',
        `export const NOME = '${pt.about.overviewTitle}';`,
        '',
        `export const PERFIL = \`\n${escapeTemplate(buildProfile(pt, contacts))}\n\${EXTRA}\`;`,
        '',
    ].join('\n');

    await writeFile(output, source);
    console.log(`Perfil do agente gerado em ${output}`);
} finally {
    await server.close();
}
