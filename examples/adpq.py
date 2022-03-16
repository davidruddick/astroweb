from astroquery.gaia import Gaia

query1 = """SELECT * FROM basic"""

job = Gaia.launch_job(query1)

results = job.get_results()

print(results)